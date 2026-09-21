/**
 * Centralized SEO, AEO, GEO & Knowledge Graph Configuration for Weblets
 * Official Website: https://weblets.bond
 * Official Brand: Weblets (weblets agency)
 * Slogan: lets make website together
 * 
 * Defines canonical metadata, search engine directives, Open Graph,
 * Twitter cards, and Schema.org structured data generators for all pages.
 */

export const BRAND = {
  name: 'weblets agency',
  legalName: 'weblets agency - lets make website together',
  alternateNames: [
    'weblets',
    'weblets agency',
    'Weblets',
    'Weblets Agency',
    'weblets.bond',
    'lets make website together'
  ],
  domain: 'https://weblets.bond',
  tagline: 'lets make website together',
  description: 'weblets agency - lets make website together. High-converting bespoke websites, e-commerce stores, responsive commercial templates, and WhatsApp lead funnels with 48-hour to 7-day express delivery.',
  logo: 'https://weblets.bond/logo.png',
  logoDark: 'https://weblets.bond/logo-dark.png',
  favicon: 'https://weblets.bond/favicon.png',
  email: 'contact@weblets.bond',
  phone: '+918710043923',
  displayPhone: '+91 87100 43923',
  address: {
    streetAddress: 'Kolkata & Bangalore Hubs',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    postalCode: '700001',
    addressCountry: 'IN'
  },
  geo: {
    region: 'IN-WB',
    placename: 'Kolkata, West Bengal, India',
    latitude: '22.5726',
    longitude: '88.3639'
  },
  priceRange: '₹4,999 - ₹49,999 / $149 - $1,499',
  turnaroundSLA: '48 Hours to 7 Days',
  founders: [
    {
      name: 'Soham Dutta',
      jobTitle: 'Lead Architect & Full-Stack Systems',
      url: 'https://linkedin.com/in/soham-dutta',
      sameAs: [
        'https://linkedin.com/in/soham-dutta',
        'https://github.com/sohamart',
        'https://instagram.com/sohamart'
      ]
    },
    {
      name: 'Sayantan',
      jobTitle: 'Technical Lead & Frontend Engineering',
      url: 'https://weblets.bond/team',
      sameAs: ['https://weblets.bond/team']
    },
    {
      name: 'Achinta',
      jobTitle: 'Operations & Product Delivery Lead',
      url: 'https://weblets.bond/team',
      sameAs: ['https://weblets.bond/team']
    }
  ],
  socials: [
    'https://instagram.com/weblets_official',
    'https://linkedin.com/company/weblets',
    'https://github.com/weblets',
    'https://twitter.com/weblets'
  ],
  knowsAbout: [
    'Bespoke Web Development',
    'Full-Stack MERN Engineering',
    'React and Vite Performance Optimization',
    'Node.js and MongoDB Cloud Architecture',
    'UI/UX Liquid Glassmorphic Design',
    'E-Commerce Store Development',
    'WhatsApp Order Automation',
    'Technical SEO and Answer Engine Optimization (AEO)',
    'Generative Engine Optimization (GEO)',
    'Sub-second Web Core Vitals Optimization'
  ],
  areasServed: [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'United Arab Emirates',
    'Europe'
  ]
};

export const DEFAULT_KEYWORDS = [
  'weblets agency',
  'weblets',
  'lets make website together',
  'weblets.bond',
  'weblets agency website',
  'weblets web development',
  'weblets website design',
  'weblets software',
  'weblets MERN development',
  'bespoke web development',
  'fast website agency',
  'ecommerce website',
  'WhatsApp order website',
  'restaurant website template',
  'salon booking website',
  'real estate website',
  'high converting landing pages'
].join(', ');

export const SEO_PAGES = {
  home: {
    title: 'weblets agency - lets make website together',
    description: 'weblets agency - lets make website together. High-performance bespoke websites, e-commerce stores, responsive commercial templates, and WhatsApp lead funnels with 48h delivery.',
    canonical: 'https://weblets.bond/',
    h1: 'We Build Websites That Turn Your Vision Into A Global Brand.',
    ogType: 'website',
    priority: 1.0,
    changefreq: 'daily'
  },
  services: {
    title: 'Web Development & Digital Growth Services | Weblets',
    description: 'Explore Weblets services: bespoke business websites, high-converting landing pages, e-commerce stores, portfolio showcases, and custom MERN web applications with 48-hour turnarounds.',
    canonical: 'https://weblets.bond/services',
    h1: 'Web Development & Digital Growth Services',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  demos: {
    title: 'Live Website Templates & Interactive Demos | Weblets',
    description: 'Browse 12+ live working website demos for Restaurants, Cafes, Salons, Gyms, Real Estate, Clinics, and Boutiques with instant 48-hour customization.',
    canonical: 'https://weblets.bond/demos',
    h1: 'Live Website Demos & Interactive Niche Templates',
    ogType: 'website',
    priority: 0.95,
    changefreq: 'daily'
  },
  pricing: {
    title: 'Website Development Packages & Pricing | Weblets',
    description: 'Transparent fixed-price website packages from ₹4,999 ($149). Zero hidden fees, GST invoicing, 48-hour delivery, and turnkey hosting options.',
    canonical: 'https://weblets.bond/pricing',
    h1: 'Transparent Website Development Packages & Pricing',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  portfolio: {
    title: 'Projects & Portfolio — Digital Transformations | Weblets',
    description: 'Discover case studies and delivered digital flagships by Weblets. Real conversion results, sub-second performance, and custom UI design.',
    canonical: 'https://weblets.bond/portfolio',
    h1: 'Projects & Portfolio — Digital Transformations by Weblets',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  team: {
    title: 'Our Team — Founders & Engineering Architects | Weblets',
    description: 'Meet the founders and engineering architects behind Weblets: Soham Dutta, Sayantan, and Achinta. Direct founder access on every web project.',
    canonical: 'https://weblets.bond/team',
    h1: 'Our Team — Meet the Founders & Architects Behind Weblets',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  about: {
    title: 'About Weblets | Lets make website together',
    description: 'Learn about Weblets, our mission, and engineering philosophy. Combining Apple-grade liquid glass design, sub-second speed, and express turnarounds.',
    canonical: 'https://weblets.bond/about',
    h1: 'About Weblets — Lets make website together',
    ogType: 'website',
    priority: 0.8,
    changefreq: 'monthly'
  },
  contact: {
    title: 'Contact Weblets | Start Your Web Project',
    description: 'Get in touch with Weblets. Request an instant 15-minute phone callback, submit project requirements, or connect directly with our engineering team.',
    canonical: 'https://weblets.bond/contact',
    h1: 'Contact Weblets — Start Your Website Project',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'monthly'
  },
  getStarted: {
    title: 'Get Started — Fast-Track Website Requirement Builder | Weblets',
    description: 'Launch your project with our interactive 3-minute website requirement builder. Select your niche, features, and receive an instant blueprint proposal.',
    canonical: 'https://weblets.bond/get-started',
    h1: 'Smart Website Requirement & Project Blueprint Builder',
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly'
  },
  trackOrder: {
    title: 'Track Order — Live Project Sprint & Milestones | Weblets',
    description: 'Track your real-time website engineering sprint, design milestones, 6-stage roadmap, and live delivery timeline using your Order ID.',
    canonical: 'https://weblets.bond/track-order',
    h1: 'Track Your Website Sprint & Milestones',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'daily'
  },
  appDownload: {
    title: 'Download Official Weblets Mobile App (PWA & APK) | Weblets',
    description: 'Download the official Weblets mobile app for Android and iOS. Track orders in real-time, browse live templates, and receive instant push updates.',
    canonical: 'https://weblets.bond/app',
    h1: 'Download Official Weblets Mobile App',
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly'
  },
  terms: {
    title: 'Terms and Conditions | Weblets',
    description: 'Official Terms of Service for Weblets (weblets.bond). Transparent 48-hour SLAs, full code ownership rights, milestone sign-offs, and policies.',
    canonical: 'https://weblets.bond/terms',
    h1: 'Terms and Conditions',
    ogType: 'website',
    priority: 0.5,
    changefreq: 'monthly'
  },
  privacy: {
    title: 'Privacy Policy | Weblets',
    description: 'Learn how Weblets protects your data with enterprise-grade encryption, strict role-based access, and zero third-party data selling.',
    canonical: 'https://weblets.bond/privacy',
    h1: 'Privacy Policy',
    ogType: 'website',
    priority: 0.5,
    changefreq: 'monthly'
  },
  notFound: {
    title: 'Page Not Found (404) | Weblets',
    description: 'The requested page was not found. Browse our live website templates or return to the Weblets homepage.',
    canonical: 'https://weblets.bond/404',
    h1: 'Page Not Found',
    robots: 'noindex, nofollow'
  }
};

/**
 * Normalizes and builds absolute canonical URLs
 */
export function generateCanonicalURL(path = '') {
  if (!path || path === '/' || path === '') return `${BRAND.domain}/`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Strip trailing slash for subpaths to maintain consistent canonicalization
  const trimmedPath = cleanPath.length > 1 && cleanPath.endsWith('/') 
    ? cleanPath.slice(0, -1) 
    : cleanPath;
  return `${BRAND.domain}${trimmedPath}`;
}

/**
 * Centralized Schema.org Organization Graph Node
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BRAND.domain}/#organization`,
    name: BRAND.name,
    legalName: BRAND.legalName,
    alternateName: BRAND.alternateNames,
    url: `${BRAND.domain}/`,
    logo: BRAND.logo,
    image: BRAND.logo,
    description: BRAND.description,
    priceRange: BRAND.priceRange,
    telephone: BRAND.phone,
    email: BRAND.email,
    slogan: BRAND.tagline,
    address: {
      '@type': 'PostalAddress',
      ...BRAND.address
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BRAND.geo.latitude,
      longitude: BRAND.geo.longitude
    },
    areaServed: BRAND.areasServed.map((country) => ({
      '@type': 'Country',
      name: country
    })),
    knowsAbout: BRAND.knowsAbout,
    founder: BRAND.founders.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.jobTitle,
      url: f.url,
      sameAs: f.sameAs
    })),
    sameAs: BRAND.socials,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BRAND.phone,
      contactType: 'customer service',
      email: BRAND.email,
      availableLanguage: ['English', 'Hindi', 'Bengali'],
      areaServed: 'Worldwide'
    }
  };
}

/**
 * Centralized Schema.org WebSite Graph Node
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BRAND.domain}/#website`,
    name: BRAND.legalName,
    alternateName: BRAND.alternateNames,
    url: `${BRAND.domain}/`,
    description: BRAND.description,
    publisher: {
      '@type': 'Organization',
      '@id': `${BRAND.domain}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BRAND.domain}/demos?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en'
  };
}

/**
 * Centralized Schema.org WebPage Graph Node
 */
export function generateWebPageSchema(title, description, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BRAND.domain}/#website`
    },
    about: {
      '@type': 'Organization',
      '@id': `${BRAND.domain}/#organization`
    },
    inLanguage: 'en'
  };
}

/**
 * Centralized Schema.org BreadcrumbList Generator
 */
export function generateBreadcrumbSchema(breadcrumbs = [], pathname = '/') {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BRAND.domain}/`
    }
  ];

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    breadcrumbs.forEach((bc, idx) => {
      const bcUrl = String(bc.url || bc.path || bc.href || '/').trim();
      items.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: bc.name || 'Page',
        item: bcUrl.startsWith('http') ? bcUrl : generateCanonicalURL(bcUrl)
      });
    });
  } else if (pathname && pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    let accumPath = '';
    segments.forEach((segment, idx) => {
      accumPath += `/${segment}`;
      const formatted = segment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      items.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: formatted,
        item: generateCanonicalURL(accumPath)
      });
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
}

/**
 * Centralized Schema.org FAQPage Generator
 */
export function generateFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question || faq.q || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a || ''
      }
    }))
  };
}

/**
 * Centralized Schema.org Service ItemList Generator
 */
export function generateServiceSchema(servicesList = []) {
  if (!Array.isArray(servicesList) || servicesList.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: servicesList.map((srv, idx) => ({
      '@type': 'Service',
      position: idx + 1,
      name: srv.title || srv.name || '',
      description: srv.description || srv.tagline || '',
      serviceType: 'Web Development',
      provider: {
        '@type': 'Organization',
        '@id': `${BRAND.domain}/#organization`,
        name: BRAND.name
      },
      areaServed: BRAND.areasServed.map((c) => ({ '@type': 'Country', name: c })),
      offers: {
        '@type': 'Offer',
        price: srv.startingPriceInr ? String(srv.startingPriceInr).replace(/[^0-9]/g, '') : '9999',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      }
    }))
  };
}

/**
 * Centralized Schema.org Product / Live Demo Template Generator
 */
export function generateProductSchema(demo) {
  if (!demo) return null;
  const rawPrice = demo.priceInr || demo.startingPriceInr || demo.price || '4999';
  const cleanPrice = String(rawPrice).replace(/[^0-9]/g, '') || '4999';
  const slug = demo.slug || demo.id || demo._id || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: demo.title || 'Weblets Website Template',
    description: demo.description || demo.shortDescription || 'High-performance bespoke website demo by Weblets with 48h express delivery.',
    image: demo.heroImage || demo.thumbnail || BRAND.logo,
    url: `${BRAND.domain}/demos/${slug}`,
    category: demo.category || 'Website Template',
    brand: {
      '@type': 'Brand',
      name: BRAND.name
    },
    offers: {
      '@type': 'Offer',
      price: cleanPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${BRAND.domain}/demos/${slug}`,
      seller: {
        '@type': 'Organization',
        '@id': `${BRAND.domain}/#organization`
      }
    }
  };
}

/**
 * Centralized Schema.org SoftwareApplication / MobileApp Generator
 */
export function generateSoftwareApplicationSchema(appDetails = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appDetails.name || 'Weblets Mobile App',
    operatingSystem: appDetails.os || 'Android, iOS, Web (PWA)',
    applicationCategory: 'BusinessApplication',
    softwareVersion: appDetails.version || 'v2.4.0',
    fileSize: appDetails.fileSize || '24.8 MB',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Organization',
      '@id': `${BRAND.domain}/#organization`
    },
    description: appDetails.description || 'Manage client orders, track engineering sprints in real-time, preview live demo templates, and receive instant push updates.'
  };
}
