import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  BRAND, 
  DEFAULT_KEYWORDS, 
  generateCanonicalURL, 
  generateBreadcrumbSchema, 
  generateWebPageSchema,
  generateOrganizationSchema,
  generateWebSiteSchema
} from '../../config/seoConfig';

/**
 * Enterprise Production-Ready SEO, AEO & GEO Component for Weblets
 * 
 * Responsibilities:
 * 1. Synchronizes document <title> with brand hierarchy (e.g., "Page Title | weblets agency")
 * 2. Injects meta descriptions, keywords, author, and search engine directives (robots)
 * 3. Injects self-referencing canonical URL <link rel="canonical">
 * 4. Manages full Open Graph & Twitter Card preview tags (for WhatsApp, Facebook, LinkedIn, X)
 * 5. Dynamically injects linked Schema.org Knowledge Graph (WebPage, BreadcrumbList, Organization, custom schemas)
 * 6. Enforces strict noindex/nofollow on authenticated, admin, and non-indexable routes
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
  author = 'weblets agency (Soham Dutta, Sayantan & Achinta)'
}) {
  const location = useLocation();
  const domain = BRAND.domain;
  
  // Calculate canonical URL with strict normalization
  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : generateCanonicalURL(canonical))
    : generateCanonicalURL(location.pathname);

  // Process title: ensure brand inclusion without duplicate brand naming
  const defaultTitle = 'weblets agency - lets make website together';
  let activeTitle = defaultTitle;
  if (title) {
    const lower = title.toLowerCase();
    activeTitle = (lower.includes('weblets') || lower.includes('lets make website'))
      ? title
      : `${title} | weblets agency`;
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
      if (!content && content !== '') return;
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
    setMetaTag('name', 'bingbot', activeRobots);
    setMetaTag('name', 'author', author);
    setMetaTag('name', 'publisher', BRAND.name);
    setMetaTag('name', 'application-name', BRAND.name);
    setMetaTag('name', 'theme-color', '#2563eb');

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
    setMetaTag('property', 'og:site_name', 'weblets agency - lets make website together');
    setMetaTag('property', 'og:title', activeTitle);
    setMetaTag('property', 'og:description', activeDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', activeImage);
    setMetaTag('property', 'og:image:secure_url', activeImage);
    setMetaTag('property', 'og:image:alt', activeTitle);
    setMetaTag('property', 'og:image:type', activeImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
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

    // 6. Dynamic Breadcrumb & WebPage Schema Generation (Knowledge Graph)
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, location.pathname);
    const webPageSchema = generateWebPageSchema(activeTitle, activeDesc, canonicalUrl);

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
        schema.filter(Boolean).forEach((s) => schemasToInject.push(s));
      } else {
        schemasToInject.push(schema);
      }
    }

    // Wrap in Schema.org @graph container for optimal linked data graph comprehension
    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': schemasToInject
    };

    routeSchemaScript.textContent = JSON.stringify(graphSchema);
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
