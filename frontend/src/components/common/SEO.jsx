import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enterprise Dynamic SEO & OpenGraph Component
 * Generates dynamic page titles, descriptions, keyword variations (local2brand / local to brand / local 2 brand),
 * OpenGraph / Twitter Cards for social sharing (WhatsApp/Facebook/Twitter/LinkedIn previews),
 * Canonical tags, and BreadcrumbList JSON-LD structured schemas.
 */
export default function SEO({
  title,
  description,
  keywords,
  image = 'https://local2brand.cyou/logo.jpg',
  type = 'website',
  schema
}) {
  const location = useLocation();
  const domain = 'https://local2brand.cyou';
  const canonicalUrl = `${domain}${location.pathname === '/' ? '' : location.pathname}`;

  // Brand variations to rank #1 on Google for all permutations:
  // "local2brand", "local to brand", "local 2 brand", "local2brand.cyou"
  const brandKeywords = 'local2brand, local to brand, local 2 brand, local2brand.cyou, Local2Brand Agency, Local To Brand India, fast website builder, 48 hour website development, ecommerce store builder, high converting web design agency, restaurant website, cafe website, salon website, real estate website, custom web development India, WhatsApp direct order website';

  const defaultTitle = 'LOCAL2BRAND — Build Local. Think Global. | #1 Fast-Track Web Experience Engine';
  const defaultDesc = 'LOCAL2BRAND (Local To Brand) turns ambitious local businesses into world-class digital brands. 48-Hour delivery, bespoke conversion UI, 12+ live commercial demo templates, and direct WhatsApp lead capture.';

  const activeTitle = title 
    ? (title.toLowerCase().includes('local2brand') || title.toLowerCase().includes('local to brand') 
        ? title 
        : `${title} | LOCAL2BRAND (Local To Brand)`)
    : defaultTitle;
    
  const activeDesc = description || defaultDesc;
  const activeKeywords = keywords ? `${keywords}, ${brandKeywords}` : brandKeywords;

  // Ensure absolute image URL for perfect preview cards on WhatsApp, Facebook, iMessage, Twitter
  const activeImage = image.startsWith('http') ? image : `${domain}${image.startsWith('/') ? '' : '/'}${image}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = activeTitle;

    // Helper function for meta tags
    const setMetaTag = (attrName, attrVal, content) => {
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
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'LOCAL2BRAND (Soham Dutta & Team)');
    setMetaTag('name', 'publisher', 'LOCAL2BRAND');
    setMetaTag('name', 'application-name', 'LOCAL2BRAND');

    // 3. OpenGraph / Facebook / WhatsApp / LinkedIn Preview
    setMetaTag('property', 'og:site_name', 'LOCAL2BRAND — Local To Brand');
    setMetaTag('property', 'og:title', activeTitle);
    setMetaTag('property', 'og:description', activeDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', activeImage);
    setMetaTag('property', 'og:image:secure_url', activeImage);
    setMetaTag('property', 'og:image:alt', `${activeTitle} - LOCAL2BRAND`);
    setMetaTag('property', 'og:image:type', activeImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    setMetaTag('property', 'og:locale', 'en_US');

    // 4. Twitter / X Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', activeTitle);
    setMetaTag('name', 'twitter:description', activeDesc);
    setMetaTag('name', 'twitter:image', activeImage);
    setMetaTag('name', 'twitter:site', '@local2brand');
    setMetaTag('name', 'twitter:creator', '@local2brand');

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. Dynamic Breadcrumb & WebPage Schema injection
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbListItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: domain
      }
    ];

    let currentPath = domain;
    pathSegments.forEach((segment, idx) => {
      currentPath += `/${segment}`;
      const formattedName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbListItems.push({
        '@type': 'ListItem',
        position: idx + 2,
        name: formattedName,
        item: currentPath
      });
    });

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbListItems
    };

    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: activeTitle,
      description: activeDesc,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'LOCAL2BRAND',
        alternateName: ['Local to Brand', 'Local 2 Brand', 'Local2Brand'],
        url: domain
      }
    };

    // Inject or update route dynamic schema script
    let routeSchemaScript = document.getElementById('route-seo-schema');
    if (!routeSchemaScript) {
      routeSchemaScript = document.createElement('script');
      routeSchemaScript.id = 'route-seo-schema';
      routeSchemaScript.type = 'application/ld+json';
      document.head.appendChild(routeSchemaScript);
    }
    
    const combinedSchemas = schema 
      ? [breadcrumbSchema, webPageSchema, schema] 
      : [breadcrumbSchema, webPageSchema];

    routeSchemaScript.textContent = JSON.stringify(combinedSchemas);

  }, [activeTitle, activeDesc, activeKeywords, canonicalUrl, activeImage, type, schema, location.pathname]);

  return null;
}
