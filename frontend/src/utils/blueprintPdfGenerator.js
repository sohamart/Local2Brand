/**
 * WEBLETS / LOCAL2BRAND Official Corporate Project Blueprint PDF Generator
 * Generates an executive, fully detailed multi-page printable architecture specification document with:
 * - Company branding, header, footer, official verification stamp, and NDA notice
 * - All questions and client submitted answers
 * - Visual design tokens, selected pages, features, integrations, and hosting setup
 * - Admin quoted investment, engineering dispatch notes, and Google Drive deliverables links
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
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const currencySymbol = formData?.country === 'India' || !formData?.country ? '₹' : '$';
  const rawPrice = submissionSuccess?.totalApproxPrice || formData?.totalPrice || formData?.totalApproxPrice || 9999;
  const formattedPrice = typeof rawPrice === 'number' ? `${currencySymbol}${rawPrice.toLocaleString('en-IN')}` : `${currencySymbol}${rawPrice}`;
  const quotedAmount = formData?.quotedAmount || submissionSuccess?.quotedAmount || '';
  const internalNotes = formData?.internalNotes || formData?.statusNotes || submissionSuccess?.internalNotes || '';
  const drivePdfLink = formData?.drivePdfLink || formData?.pdfUrl || formData?.documentUrl || submissionSuccess?.drivePdfLink || '';
  const driveLink = formData?.driveLink || formData?.assetVaultLink || submissionSuccess?.driveLink || '';
  const status = formData?.status || submissionSuccess?.status || 'Submitted';

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
    restFeatures: 'Restaurant Digital Features',
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
  const locationParts = [formData.streetAddress, formData.district || formData.clientInfo?.city, formData.state, formData.country || formData.clientInfo?.country || 'India'].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'National / International Digital Delivery';

  // Social links
  const socialStr = Array.isArray(formData.socialLinks) && formData.socialLinks.length > 0
    ? formData.socialLinks.join(' • ')
    : (formData.existingWebsite || formData.clientInfo?.existingWebsite || 'None provided');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${brandName} Project Blueprint — #${trackingId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

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
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
    }

    .doc-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 20px 24px;
      background: #ffffff;
      position: relative;
    }

    /* Executive Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #7c3aed;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }

    .brand-col {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 4px;
    }

    .brand-info h1 {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
      line-height: 1.1;
    }

    .brand-info .tagline {
      font-size: 10px;
      font-weight: 800;
      color: #7c3aed;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }

    .brand-meta {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 3px;
      line-height: 1.35;
    }

    .meta-col {
      text-align: right;
    }

    .doc-badge {
      display: inline-block;
      background: #f5f3ff;
      border: 1.5px solid #c4b5fd;
      color: #6d28d9;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 10px;
      border-radius: 999px;
      margin-bottom: 4px;
    }

    .tracking-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }

    .meta-date {
      font-size: 9px;
      color: #64748b;
      margin-top: 2px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 6px;
      margin-top: 4px;
    }

    /* Section Headings */
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #4c1d95;
      background: #faf5ff;
      border-left: 3.5px solid #7c3aed;
      padding: 4px 10px;
      margin-top: 14px;
      margin-bottom: 8px;
      border-radius: 0 6px 6px 0;
      page-break-after: avoid;
    }

    .section-title span.sec-num {
      color: #9333ea;
      margin-right: 4px;
    }

    /* Data Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
      page-break-inside: avoid;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      page-break-inside: avoid;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 7px 9px;
      page-break-inside: avoid;
    }

    .card-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }

    .card-val {
      font-size: 10.5px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
    }

    .card-val.highlight {
      color: #059669;
      font-weight: 800;
    }

    .card-val.price {
      font-size: 13px;
      color: #059669;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-tag {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      border: 1px solid #c7d2fe;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
      margin-bottom: 3px;
    }

    /* Highlight Notification & Dispatch Boxes */
    .dispatch-box {
      background: #eef2ff;
      border: 1.5px solid #c7d2fe;
      border-radius: 8px;
      padding: 9px 12px;
      margin-top: 8px;
      page-break-inside: avoid;
    }

    .dispatch-box strong {
      color: #3730a3;
      font-size: 10px;
      display: block;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .dispatch-box p {
      margin: 0;
      font-size: 10px;
      color: #1e1b4b;
      font-weight: 600;
      line-height: 1.45;
    }

    /* Deliverables Link Box */
    .deliverables-box {
      background: #faf5ff;
      border: 1.5px solid #d8b4fe;
      border-radius: 8px;
      padding: 9px 12px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }

    .deliverables-box .title {
      font-size: 10.5px;
      font-weight: 800;
      color: #581c87;
    }

    .deliverables-box .sub {
      font-size: 9px;
      color: #7e22ce;
      margin-top: 1px;
    }

    .deliverables-box a {
      background: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      font-weight: 800;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    /* Commercial Highlight Box */
    .commercial-box {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border: 1.5px solid #c4b5fd;
      border-radius: 9px;
      padding: 10px 12px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }

    .commercial-box .title {
      font-size: 11px;
      font-weight: 800;
      color: #4c1d95;
    }

    .commercial-box .sub {
      font-size: 9px;
      color: #6b21a8;
      margin-top: 1px;
    }

    /* Sign-off & Stamp */
    .signoff-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 14px;
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      page-break-inside: avoid;
    }

    .nda-notice {
      font-size: 8.5px;
      color: #64748b;
      line-height: 1.35;
    }

    .stamp-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 7px 9px;
      background: #fbfbfe;
      text-align: center;
    }

    .stamp-box .stamp-title {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
    }

    .stamp-badge {
      display: inline-block;
      margin-top: 3px;
      padding: 2px 7px;
      background: #0f172a;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      font-weight: 700;
      border-radius: 4px;
    }

    /* Footer */
    .footer {
      margin-top: 16px;
      border-top: 2px solid #7c3aed;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #64748b;
      page-break-inside: avoid;
    }

    .footer-left strong {
      color: #0f172a;
    }

    .footer-right {
      text-align: right;
    }

    /* Print action bar */
    .no-print-bar {
      background: #0f172a;
      color: #fff;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .print-btn {
      background: #7c3aed;
      color: #ffffff;
      border: none;
      font-weight: 800;
      font-size: 11.5px;
      padding: 7px 16px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(124,58,237,0.4);
      transition: all 0.2s;
    }

    .print-btn:hover {
      background: #6d28d9;
    }

    .page-break {
      page-break-before: always;
      margin-top: 20px;
    }

    @media print {
      .no-print-bar {
        display: none !important;
      }
      .doc-container {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Top Floating Controls for User Preview -->
  <div class="no-print-bar">
    <div style="font-size: 12px; font-weight: 700;">
      📄 ${brandName} Architecture Blueprint Ready • <span>Order #${trackingId}</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="print-btn" style="background: #334155;" onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="doc-container">
    <!-- 1. Executive Corporate Header -->
    <div class="header">
      <div class="brand-col">
        <img
          src="${fullLogoUrl}"
          alt="${brandName} Logo"
          class="logo-img"
          onerror="this.style.display='none'"
        />
        <div class="brand-info">
          <h1>${brandName}</h1>
          <div class="tagline">${tagline}</div>
          <div class="brand-meta">
            🌐 ${domain} • ✉️ ${supportEmail}<br />
            📞 ${phone} • 📱 WhatsApp: ${whatsapp}<br />
            📍 HQ: ${officeLocation}
          </div>
        </div>
      </div>

      <div class="meta-col">
        <div class="doc-badge">Official Architecture Blueprint</div>
        <div class="tracking-id">#${trackingId}</div>
        <div class="meta-date">Issued: ${timestamp}</div>
        <div>
          <span class="status-pill">
            ● Status: ${status}
          </span>
        </div>
      </div>
    </div>

    <!-- 2. Section 1: Client & Enterprise Profile -->
    <div class="section-title">
      <div><span class="sec-num">01.</span> Client &amp; Enterprise Profile</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Authorized Stakeholder</div>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-label">Authorized Client Name</div>
        <div class="card-val">${formData.fullName || formData.clientInfo?.ownerName || formData.clientInfo?.contactPerson || 'Valued Client'}</div>
      </div>
      <div class="card">
        <div class="card-label">Brand / Business Name</div>
        <div class="card-val">${formData.businessName || formData.clientInfo?.businessName || formData.websiteTypeName || 'Private Client Project'}</div>
      </div>
      <div class="card">
        <div class="card-label">Direct Mobile / WhatsApp</div>
        <div class="card-val">${formData.whatsappNumber || formData.mobileNumber || formData.clientInfo?.mobile || formData.clientInfo?.phone || 'Provided on onboarding'}</div>
      </div>
      <div class="card">
        <div class="card-label">Official Contact Email</div>
        <div class="card-val">${formData.emailAddress || formData.clientInfo?.email || 'Provided on onboarding'}</div>
      </div>
      <div class="card">
        <div class="card-label">Territory / Location</div>
        <div class="card-val">${locationStr}</div>
      </div>
      <div class="card">
        <div class="card-label">Existing Digital Footprint</div>
        <div class="card-val" style="font-size: 9.5px;">${socialStr}</div>
      </div>
    </div>

    <!-- 3. Section 2: Architecture & Project Scope -->
    <div class="section-title">
      <div><span class="sec-num">02.</span> Architecture, Systems &amp; Scope</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Engineering Directives</div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-label">Industry Classification &amp; Niche</div>
        <div class="card-val" style="text-transform: capitalize;">
          ${formData.selectedCategory || formData.websiteTypeName || formData.websiteType || 'Custom Bespoke Website'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Selected Base Layout / Template</div>
        <div class="card-val">
          ${formData.appliedTemplateName || formData.templateName || 'Bespoke Custom Glassmorphic Architecture'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Backend &amp; CMS Systems</div>
        <div class="card-val">${formData.backendChoice || formData.backendRequirement || formData.adminPanelType || 'Full Dynamic Admin Panel + CRM'}</div>
      </div>
      <div class="card">
        <div class="card-label">WhatsApp Lead Routing &amp; Funnel</div>
        <div class="card-val">${fmtArr(formData.whatsappIntegration || formData.whatsappOptions || 'Direct Lead Capture & Instant Ordering')}</div>
      </div>
    </div>

    ${Array.isArray(formData.selectedPages) && formData.selectedPages.length > 0 ? `
    <div class="card" style="margin-top: 6px;">
      <div class="card-label">Selected Website Pages Included (${formData.selectedPages.length})</div>
      <div style="margin-top: 3px;">
        ${formData.selectedPages.map((p) => `<span class="badge-tag">${p}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${Array.isArray(formData.selectedFeatures) && formData.selectedFeatures.length > 0 ? `
    <div class="card" style="margin-top: 6px;">
      <div class="card-label">Interactive Modules &amp; Features (${formData.selectedFeatures.length})</div>
      <div style="margin-top: 3px;">
        ${formData.selectedFeatures.map((f) => `<span class="badge-tag">${f}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- 4. Section 3: Industry Specific Questionnaire & Submitted Answers -->
    ${dynamicQuestionList.length > 0 ? `
    <div class="section-title">
      <div><span class="sec-num">03.</span> Industry Specific Questionnaire &amp; Client Answers</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">${dynamicQuestionList.length} Parameters Logged</div>
    </div>
    <div class="grid-2">
      ${dynamicQuestionList.map((item) => `
        <div class="card">
          <div class="card-label">${item.label}</div>
          <div class="card-val">${item.value}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- 5. Section 4: Creative UI/UX & Design Tokens -->
    <div class="section-title">
      <div><span class="sec-num">04.</span> Creative Direction, UI/UX &amp; Media Tokens</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Design System</div>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-label">Visual Art Direction</div>
        <div class="card-val">${formData.visualStyle || formData.answers?.designStyle || 'Modern Glassmorphic & Ultra-Clean'}</div>
      </div>
      <div class="card">
        <div class="card-label">Color Theme Mode</div>
        <div class="card-val">${formData.colorMode || formData.answers?.colorMode || 'Adaptive Light & Dark Modes'}</div>
      </div>
      <div class="card">
        <div class="card-label">Color Palette Accents</div>
        <div class="card-val">
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: ${formData.primaryColor || '#7c3aed'}; vertical-align: middle; margin-right: 2px; border: 1px solid #cbd5e1;"></span>
          ${formData.primaryColor || '#7c3aed'} / 
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: ${formData.secondaryColor || '#3b82f6'}; vertical-align: middle; margin-right: 2px; border: 1px solid #cbd5e1;"></span>
          ${formData.secondaryColor || '#3b82f6'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Brand Logo Asset</div>
        <div class="card-val">${formData.hasLogo || (formData.logoFile ? 'Uploaded Asset Attached' : 'Design Studio Standard')}</div>
      </div>
      <div class="card">
        <div class="card-label">Product / Store Photos</div>
        <div class="card-val">${formData.hasPhotos || (formData.photosFiles?.length ? `${formData.photosFiles.length} Photos Attached` : 'Studio Stock & AI Generated')}</div>
      </div>
      <div class="card">
        <div class="card-label">Copywriting &amp; Content</div>
        <div class="card-val">${formData.hasContent || 'Professional Copywriting Included'}</div>
      </div>
    </div>

    <!-- 6. Section 5: Domain & Cloud Infrastructure -->
    <div class="section-title">
      <div><span class="sec-num">05.</span> Domain, Cloud Infrastructure &amp; Security</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Edge Hosting</div>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-label">Domain Allocation</div>
        <div class="card-val">${formData.domainStatus || 'New Domain Registration (.com / .in)'}</div>
      </div>
      <div class="card">
        <div class="card-label">Preferred Domain URL</div>
        <div class="card-val">${formData.domainName ? `${formData.domainName}${formData.domainExtension || '.com'}` : 'To be confirmed during kickoff'}</div>
      </div>
      <div class="card">
        <div class="card-label">Cloud Hosting &amp; CDN</div>
        <div class="card-val">${formData.hostingStatus || 'High-Speed NVMe Cloud + Global SSL'}</div>
      </div>
    </div>

    <!-- 7. Section 6: Commercial Investment & Delivery Sprint -->
    <div class="section-title">
      <div><span class="sec-num">06.</span> Commercial Investment &amp; Delivery Sprint</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Billing &amp; Timeline</div>
    </div>
    
    <div class="commercial-box">
      <div>
        <div class="title">
          ${quotedAmount ? `Official Quoted Investment: <span style="color: #059669; font-size: 13.5px; font-weight: 900;">${quotedAmount}</span>` : `Estimated Investment Baseline: <span style="color: #059669; font-size: 13.5px; font-weight: 900;">${formattedPrice}</span>`}
        </div>
        <div class="sub">
          ⚡ Turnaround Speed: <strong>${formData.expectedLaunchDate || formData.timeline || '⚡ 48 - 72 Hours Rapid Sprint'}</strong> • Free SSL + Custom Domain Setup Included
        </div>
      </div>
      <div style="text-align: right;">
        ${quotedAmount ? `
          <span class="badge-tag" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0; font-weight: 800;">
            ✓ Quota Certified by Engineering Desk
          </span>
        ` : formData.couponCode ? `
          <span class="badge-tag" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">
            🎁 Coupon ${formData.couponCode} (${formData.discountPercent || 20}% OFF Applied)
          </span>
        ` : `
          <span class="badge-tag" style="background: #f8fafc; color: #475569; border-color: #cbd5e1;">
            Official Tier Estimate
          </span>
        `}
      </div>
    </div>

    <!-- Admin Engineering Status Dispatch Box (If Present) -->
    ${internalNotes ? `
    <div class="dispatch-box">
      <strong>Engineering Team Status Dispatch &amp; Handover Directives:</strong>
      <p>${internalNotes}</p>
    </div>
    ` : ''}

    <!-- Admin Attached Quotation PDF & Drive Assets Vault (If Present) -->
    ${(drivePdfLink || driveLink) ? `
    <div class="deliverables-box">
      <div>
        <div class="title">Official Project Quotation PDF &amp; Google Drive Asset Vault</div>
        <div class="sub">
          ${drivePdfLink ? '📄 Official Deliverables PDF Attached' : ''} ${drivePdfLink && driveLink ? '•' : ''} ${driveLink ? '📁 Google Drive Shared Workspace Linked' : ''}
        </div>
      </div>
      <div style="display: flex; gap: 6px;">
        ${drivePdfLink ? `<a href="${drivePdfLink}" target="_blank">View PDF Document &rarr;</a>` : ''}
        ${driveLink ? `<a href="${driveLink}" target="_blank" style="background: #4f46e5;">Open Drive Folder &rarr;</a>` : ''}
      </div>
    </div>
    ` : ''}

    ${(formData.additionalRequirements || formData.designInstructions || formData.referenceWebsites) ? `
    <!-- Special Directives & Client Notes -->
    <div class="section-title">
      <div><span class="sec-num">07.</span> Special Directives &amp; Client Notes</div>
    </div>
    <div class="card" style="margin-top: 4px;">
      <div class="card-val" style="font-weight: 500; font-size: 10px; line-height: 1.5;">
        ${[formData.additionalRequirements, formData.designInstructions, formData.referenceWebsites ? `Reference URL: ${formData.referenceWebsites}` : ''].filter(Boolean).join(' • ')}
      </div>
    </div>
    ` : ''}

    <!-- 8. Sign-off, Legal NDA & Stamp -->
    <div class="signoff-row">
      <div class="nda-notice">
        <strong>🔒 Confidentiality &amp; NDA Protection:</strong><br />
        This architecture blueprint and all associated engineering specifications are strictly confidential and protected under ${brandName}'s Enterprise Non-Disclosure Agreement. All design intellectual property, source code, and cloud assets transfer exclusively to the client upon project settlement.
      </div>
      <div class="stamp-box">
        <div class="stamp-title">Engineering Desk Verification</div>
        <div class="stamp-badge">VERIFIED &bull; WEBLETS CORE</div>
        <div style="font-size: 8px; color: #64748b; margin-top: 3px;">Lead Architect Desk &bull; Sprint 2026.4</div>
      </div>
    </div>

    <!-- 9. Corporate Footer -->
    <div class="footer">
      <div class="footer-left">
        <strong>${brandName} Digital Engineering Systems</strong> • Web: https://${domain} • Support: ${supportEmail}
      </div>
      <div class="footer-right">
        Document ID: <code>${trackingId}</code> • Official Multi-Page Blueprint
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 450);
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
