/**
 * WEBLETS / LOCAL2BRAND Official Corporate Project Blueprint PDF Generator
 * Generates an executive, fully detailed printable architecture specification document with company logo, header, footer, NDA notice, and itemized parameters.
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
  
  // Resolve absolute or fallback logo
  const logoUrl = settings?.logoLightUrl || settings?.logoDarkUrl || '/logo.png';
  const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl : `${window.location.origin}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;

  const trackingId = submissionSuccess?.id || formData?.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const currencySymbol = formData?.country === 'India' || !formData?.country ? '₹' : '$';
  const rawPrice = submissionSuccess?.totalApproxPrice || formData?.totalPrice || 9999;
  const formattedPrice = typeof rawPrice === 'number' ? `${currencySymbol}${rawPrice.toLocaleString('en-IN')}` : `${currencySymbol}${rawPrice}`;

  // Helper to safely format array or string values
  const fmtArr = (val) => {
    if (Array.isArray(val) && val.length > 0) return val.join(', ');
    if (typeof val === 'string' && val.trim()) return val;
    return 'Standard / As Prescribed';
  };

  // Extract category-specific details
  const cat = formData?.selectedCategory?.toLowerCase() || '';
  const categorySpecificRows = [];

  if (cat.includes('restaurant') || cat.includes('food')) {
    if (formData.restCuisine) categorySpecificRows.push({ label: 'Cuisine Type', val: formData.restCuisine });
    if (formData.restFeatures?.length) categorySpecificRows.push({ label: 'Food & Dining Features', val: fmtArr(formData.restFeatures) });
    if (formData.restStyle) categorySpecificRows.push({ label: 'Atmosphere / Style', val: formData.restStyle });
  } else if (cat.includes('cafe') || cat.includes('coffee')) {
    if (formData.cafeSpecialty) categorySpecificRows.push({ label: 'Café Specialty & Menu', val: formData.cafeSpecialty });
    if (formData.cafeHours) categorySpecificRows.push({ label: 'Operating Hours', val: formData.cafeHours });
    if (formData.cafeFeatures?.length) categorySpecificRows.push({ label: 'Café Digital Features', val: fmtArr(formData.cafeFeatures) });
  } else if (cat.includes('salon') || cat.includes('spa') || cat.includes('beauty')) {
    if (formData.salonServices) categorySpecificRows.push({ label: 'Services & Treatments', val: formData.salonServices });
    if (formData.salonHours) categorySpecificRows.push({ label: 'Salon Timings', val: formData.salonHours });
    if (formData.salonFeatures?.length) categorySpecificRows.push({ label: 'Booking & Slot Features', val: fmtArr(formData.salonFeatures) });
  } else if (cat.includes('gym') || cat.includes('fitness')) {
    if (formData.gymFacilities) categorySpecificRows.push({ label: 'Equipment & Facilities', val: formData.gymFacilities });
    if (formData.gymMembershipPlans) categorySpecificRows.push({ label: 'Membership Tiers', val: formData.gymMembershipPlans });
    if (formData.gymFeatures?.length) categorySpecificRows.push({ label: 'Fitness Features', val: fmtArr(formData.gymFeatures) });
  } else if (cat.includes('hotel') || cat.includes('resort') || cat.includes('stay')) {
    if (formData.hotelRoomsCount) categorySpecificRows.push({ label: 'Room Inventory', val: formData.hotelRoomsCount });
    if (formData.hotelAmenities) categorySpecificRows.push({ label: 'Hotel Amenities', val: formData.hotelAmenities });
    if (formData.hotelFeatures?.length) categorySpecificRows.push({ label: 'Stay Booking Features', val: fmtArr(formData.hotelFeatures) });
  } else if (cat.includes('real') || cat.includes('estate') || cat.includes('property')) {
    if (formData.rePropertyTypes?.length) categorySpecificRows.push({ label: 'Property Types', val: fmtArr(formData.rePropertyTypes) });
    if (formData.reLocationsOperated) categorySpecificRows.push({ label: 'Operating Zones', val: formData.reLocationsOperated });
  } else if (cat.includes('clinic') || cat.includes('doctor') || cat.includes('health') || cat.includes('dental')) {
    if (formData.clinicSpecialty) categorySpecificRows.push({ label: 'Medical Specialty', val: formData.clinicSpecialty });
    if (formData.clinicTimings) categorySpecificRows.push({ label: 'OPD / Consultation Hours', val: formData.clinicTimings });
    if (formData.clinicFeatures?.length) categorySpecificRows.push({ label: 'Healthcare Features', val: fmtArr(formData.clinicFeatures) });
  } else if (cat.includes('boutique') || cat.includes('ecommerce') || cat.includes('cloth')) {
    if (formData.boutiqueProducts?.length) categorySpecificRows.push({ label: 'Product Range', val: fmtArr(formData.boutiqueProducts) });
    if (formData.boutiquePriceRange) categorySpecificRows.push({ label: 'Price Segment', val: formData.boutiquePriceRange });
  } else if (cat.includes('coaching') || cat.includes('course') || cat.includes('lms')) {
    if (formData.coachingCourses) categorySpecificRows.push({ label: 'Courses & Curriculum', val: formData.coachingCourses });
    if (formData.coachingClassMode) categorySpecificRows.push({ label: 'Delivery Mode', val: formData.coachingClassMode });
  }

  // Location string
  const locationParts = [formData.district, formData.state, formData.country || 'India'].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Not Specified';

  // Social links
  const socialStr = Array.isArray(formData.socialLinks) && formData.socialLinks.length > 0
    ? formData.socialLinks.join(' • ')
    : (formData.existingWebsite || 'None provided');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${brandName} Project Blueprint — #${trackingId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 12mm 14mm 12mm;
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
      font-size: 11.5px;
      line-height: 1.45;
    }

    .doc-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
      position: relative;
    }

    /* Executive Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #7c3aed;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }

    .brand-col {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-img {
      width: 54px;
      height: 54px;
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
      font-size: 10.5px;
      font-weight: 700;
      color: #7c3aed;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }

    .brand-meta {
      font-size: 10px;
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
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 6px;
    }

    .tracking-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }

    .meta-date {
      font-size: 9.5px;
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
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #4c1d95;
      background: #faf5ff;
      border-left: 3.5px solid #7c3aed;
      padding: 5px 10px;
      margin-top: 14px;
      margin-bottom: 8px;
      border-radius: 0 6px 6px 0;
    }

    .section-title span.sec-num {
      color: #9333ea;
      margin-right: 4px;
    }

    /* Data Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
    }

    .card-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 2px;
    }

    .card-val {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
    }

    .card-val.highlight {
      color: #059669;
      font-weight: 800;
    }

    .card-val.price {
      font-size: 14px;
      color: #059669;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-tag {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      border: 1px solid #c7d2fe;
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-right: 4px;
      margin-bottom: 3px;
    }

    /* Commercial Highlight Box */
    .commercial-box {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border: 1.5px solid #c4b5fd;
      border-radius: 10px;
      padding: 12px 14px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .commercial-box .title {
      font-size: 12px;
      font-weight: 800;
      color: #4c1d95;
    }

    .commercial-box .sub {
      font-size: 9.5px;
      color: #6b21a8;
      margin-top: 1px;
    }

    /* Sign-off & Stamp */
    .signoff-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 16px;
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
    }

    .nda-notice {
      font-size: 9px;
      color: #64748b;
      line-height: 1.4;
    }

    .stamp-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 10px;
      background: #fbfbfe;
      text-align: center;
    }

    .stamp-box .stamp-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
    }

    .stamp-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 8px;
      background: #0f172a;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      border-radius: 4px;
    }

    /* Footer */
    .footer {
      margin-top: 20px;
      border-top: 2px solid #7c3aed;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #64748b;
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
      font-size: 12px;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(124,58,237,0.4);
      transition: all 0.2s;
    }

    .print-btn:hover {
      background: #6d28d9;
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
            ● Confirmed &amp; Queued in Sprint
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
        <div class="card-val">${formData.fullName || 'Valued Client'}</div>
      </div>
      <div class="card">
        <div class="card-label">Brand / Business Name</div>
        <div class="card-val">${formData.businessName || formData.fullName || 'Private Client Project'}</div>
      </div>
      <div class="card">
        <div class="card-label">Direct Mobile / WhatsApp</div>
        <div class="card-val">${formData.whatsappNumber || formData.mobileNumber || 'Provided during onboarding'}</div>
      </div>
      <div class="card">
        <div class="card-label">Official Contact Email</div>
        <div class="card-val">${formData.emailAddress || 'Provided during onboarding'}</div>
      </div>
      <div class="card">
        <div class="card-label">Territory / Location</div>
        <div class="card-val">${locationStr}</div>
      </div>
      <div class="card">
        <div class="card-label">Existing Digital Footprint</div>
        <div class="card-val" style="font-size: 10px;">${socialStr}</div>
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
          ${formData.selectedCategory || 'Custom Bespoke Website'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Selected Base Layout / Template</div>
        <div class="card-val">
          ${formData.appliedTemplateName || 'Bespoke Custom Glassmorphic Architecture'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Backend &amp; CMS Systems</div>
        <div class="card-val">${formData.backendChoice || formData.backendRequirement || 'Full Dynamic Admin Panel + CRM'}</div>
      </div>
      <div class="card">
        <div class="card-label">WhatsApp Lead Routing &amp; Funnel</div>
        <div class="card-val">${formData.whatsappIntegration || 'Direct Lead Capture & Instant Ordering'}</div>
      </div>
    </div>

    ${categorySpecificRows.length > 0 ? `
    <!-- Category-Specific Workflow Matrix -->
    <div style="margin-top: 8px;" class="grid-2">
      ${categorySpecificRows.map((r) => `
        <div class="card">
          <div class="card-label">${r.label}</div>
          <div class="card-val">${r.val}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- 4. Section 3: Creative UI/UX & Design Tokens -->
    <div class="section-title">
      <div><span class="sec-num">03.</span> Creative Direction, UI/UX &amp; Media Tokens</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Design System</div>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-label">Visual Art Direction</div>
        <div class="card-val">${formData.visualStyle || 'Modern Glassmorphic & Ultra-Clean'}</div>
      </div>
      <div class="card">
        <div class="card-label">Color Theme Mode</div>
        <div class="card-val">${formData.colorMode || 'Adaptive Light & Dark Modes'}</div>
      </div>
      <div class="card">
        <div class="card-label">Color Palette Accents</div>
        <div class="card-val">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${formData.primaryColor || '#7c3aed'}; vertical-align: middle; margin-right: 3px; border: 1px solid #cbd5e1;"></span>
          ${formData.primaryColor || '#7c3aed'} / 
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${formData.secondaryColor || '#3b82f6'}; vertical-align: middle; margin-right: 3px; border: 1px solid #cbd5e1;"></span>
          ${formData.secondaryColor || '#3b82f6'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Brand Logo Asset</div>
        <div class="card-val">${formData.hasLogo || (formData.logoFile ? 'Uploaded File Attached' : 'Weblets Design Studio Creation')}</div>
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

    <!-- 5. Section 4: Domain & Cloud Infrastructure -->
    <div class="section-title">
      <div><span class="sec-num">04.</span> Domain, Cloud Infrastructure &amp; Security</div>
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

    <!-- 6. Section 5: Commercial Investment & Delivery Sprint -->
    <div class="section-title">
      <div><span class="sec-num">05.</span> Commercial Investment &amp; Delivery Sprint</div>
      <div style="font-size: 9px; font-weight: 600; text-transform: none; color: #6b21a8;">Billing &amp; Timeline</div>
    </div>
    
    <div class="commercial-box">
      <div>
        <div class="title">Commercial Investment Baseline: <span style="color: #059669; font-size: 14px; font-weight: 900;">${formattedPrice}</span></div>
        <div class="sub">
          ⚡ Turnaround Speed: <strong>${formData.expectedLaunchDate || '⚡ 48 - 72 Hours Rapid Sprint'}</strong> • Free SSL + Custom Domain Setup Included
        </div>
      </div>
      <div style="text-align: right;">
        ${formData.couponCode ? `
          <span class="badge-tag" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">
            🎁 Coupon ${formData.couponCode} (${formData.discountPercent || 20}% OFF Applied)
          </span>
        ` : `
          <span class="badge-tag" style="background: #f8fafc; color: #475569; border-color: #cbd5e1;">
            Official Flat Estimate
          </span>
        `}
      </div>
    </div>

    ${(formData.additionalRequirements || formData.designInstructions || formData.referenceWebsites) ? `
    <!-- 7. Section 6: Special Directives & Client Notes -->
    <div class="section-title">
      <div><span class="sec-num">06.</span> Special Directives &amp; Client Notes</div>
    </div>
    <div class="card" style="margin-top: 4px;">
      <div class="card-val" style="font-weight: 500; font-size: 10.5px; line-height: 1.5;">
        ${[formData.additionalRequirements, formData.designInstructions, formData.referenceWebsites ? `Reference URL: ${formData.referenceWebsites}` : ''].filter(Boolean).join(' • ')}
      </div>
    </div>
    ` : ''}

    <!-- 8. Sign-off, Legal NDA & Stamp -->
    <div class="signoff-row">
      <div class="nda-notice">
        <strong>🔒 Confidentiality &amp; NDA Protection:</strong><br />
        This document and all associated engineering specifications are strictly confidential and protected by ${brandName}'s Non-Disclosure agreement. All intellectual property, source files, and design assets belong exclusively to the client upon milestone settlement.
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
        Document ID: <code>${trackingId}</code> • Page 1 of 1
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
