import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BRAND, DEFAULT_KEYWORDS } from '../../config/seoConfig';

/**
 * Enterprise Production-Ready SEO Component for Weblets
 * 
 * Responsibilities:
 * 1. Updates <title> with natural branding hierarchy (e.g., "Page Title | Weblets")
 * 2. Injects meta descriptions, keywords, author, and search engine directives (robots)
 * 3. Injects self-referencing canonical URL <link rel="canonical">
 * 4. Manages full Open Graph and Twitter Card preview tags (for WhatsApp, Facebook, LinkedIn, X)
 * 5. Dynamically injects linked Schema.org JSON-LD graph (BreadcrumbList, WebPage, and custom Schemas)
 * 6. Supports Google Search Console & Bing verification tokens via props or env vars
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  image = BRAND.logo,
  type = 'website',
  robots,
  noindex = false,
  schema,
  breadcrumbs,
  author = 'Weblets (Soham Dutta, Sayantan & Achinta)'
}) {
  const location = useLocation();
  const domain = BRAND.domain;
  
  // Calculate canonical URL
  const canonicalUrl = canonical || `${domain}${location.pathname === '/' ? '' : location.pathname}`;

  // Process title: ensure brand inclusion without duplicate brand naming
  const defaultTitle = 'Weblets | Modern Web Development & Digital Engineering Studio';
  let activeTitle = defaultTitle;
  if (title) {
    activeTitle = title.toLowerCase().includes('weblets')
      ? title
      : `${title} | Weblets`;
  }

  const activeDesc = description || BRAND.description;
  const activeKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;
  const activeRobots = noindex 
    ? 'noindex, nofollow'
    : (robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Ensure absolute image URL safely
  const rawImage = (typeof image === 'string' && image.trim()) ? image.trim() : (BRAND.logo || '/logo.png');
  const activeImage = rawImage.startsWith('http')
    ? rawImage
    : `${domain}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = activeTitle;

    // Helper function to create or update meta tags
    const setMetaTag = (attrName, attrVal, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Search Meta Tags
    setMetaTag('name', 'description', activeDesc);
    setMetaTag('name', 'keywords', activeKeywords);
    setMetaTag('name', 'robots', activeRobots);
    setMetaTag('name', 'googlebot', activeRobots);
    setMetaTag('name', 'author', author);
    setMetaTag('name', 'publisher', BRAND.name);
    setMetaTag('name', 'application-name', BRAND.name);

    // Optional Search Engine Verification Tags (from Vite env vars)
    const googleVerification = import.meta.env?.VITE_GOOGLE_SITE_VERIFICATION;
    if (googleVerification) {
      setMetaTag('name', 'google-site-verification', googleVerification);
    }
    const bingVerification = import.meta.env?.VITE_BING_SITE_VERIFICATION;
    if (bingVerification) {
      setMetaTag('name', 'msvalidate.01', bingVerification);
    }

    // 3. OpenGraph / Facebook / WhatsApp / LinkedIn Preview
    setMetaTag('property', 'og:site_name', 'Weblets — Lets make website together');
    setMetaTag('property', 'og:title', activeTitle);
    setMetaTag('property', 'og:description', activeDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', activeImage);
    setMetaTag('property', 'og:image:secure_url', activeImage);
    setMetaTag('property', 'og:image:alt', `${activeTitle}`);
    setMetaTag('property', 'og:image:type', activeImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 4. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', activeTitle);
    setMetaTag('name', 'twitter:description', activeDesc);
    setMetaTag('name', 'twitter:image', activeImage);
    setMetaTag('name', 'twitter:site', '@weblets');
    setMetaTag('name', 'twitter:creator', '@weblets');

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. Dynamic Breadcrumb & WebPage Schema Generation
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: domain
      }
    ];

    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      breadcrumbs.forEach((bc, idx) => {
        const bcUrl = String(bc.url || bc.path || bc.href || '/').trim();
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: idx + 2,
          name: bc.name || 'Page',
          item: bcUrl.startsWith('http') ? bcUrl : `${domain}${bcUrl.startsWith('/') ? '' : '/'}${bcUrl}`
        });
      });
    } else {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      let currentPath = domain;
      pathSegments.forEach((segment, idx) => {
        currentPath += `/${segment}`;
        const formattedName = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: idx + 2,
          name: formattedName,
          item: currentPath
        });
      });
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    };

    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: activeTitle,
      description: activeDesc,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${domain}/#website`,
        name: BRAND.name,
        url: domain
      },
      about: {
        '@type': 'Organization',
        '@id': `${domain}/#organization`
      }
    };

    // Inject or update dynamic schema script element
    let routeSchemaScript = document.getElementById('route-seo-schema');
    if (!routeSchemaScript) {
      routeSchemaScript = document.createElement('script');
      routeSchemaScript.id = 'route-seo-schema';
      routeSchemaScript.type = 'application/ld+json';
      document.head.appendChild(routeSchemaScript);
    }

    const schemasToInject = [breadcrumbSchema, webPageSchema];
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    routeSchemaScript.textContent = JSON.stringify(schemasToInject);
  }, [
    activeTitle,
    activeDesc,
    activeKeywords,
    activeRobots,
    canonicalUrl,
    activeImage,
    type,
    schema,
    breadcrumbs,
    author,
    location.pathname,
    domain
  ]);

  return null;
}
