import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Dynamic SEO Component
 * Automatically manages Page Titles, Meta Descriptions, OpenGraph, Canonical URLs & Breadcrumb JSON-LD schemas per route.
 */
export default function SEO({
  title,
  description,
  keywords,
  image = 'https://local2brand.com/logo.jpg',
  type = 'website'
}) {
  const location = useLocation();
  const canonicalUrl = `https://local2brand.com${location.pathname === '/' ? '' : location.pathname}`;

  const defaultTitle = 'LOCAL2BRAND — Build Local. Think Global. | Premium Web Agency';
  const defaultDesc = 'We build digital experiences that turn local brands into big brands. 48-Hour delivery, high-converting bespoke websites, e-commerce stores, and 12 niche commercial templates with WhatsApp checkout.';
  const defaultKeywords = 'website development, web design agency India, local to brand, restaurant website, ecommerce store, salon website, real estate website, custom web development, WhatsApp order website, high converting landing page';

  const activeTitle = title ? `${title} | LOCAL2BRAND` : defaultTitle;
  const activeDesc = description || defaultDesc;
  const activeKeywords = keywords || defaultKeywords;

  useEffect(() => {
    // Update document title
    document.title = activeTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName, attrVal, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMetaTag('name', 'description', activeDesc);
    setMetaTag('name', 'keywords', activeKeywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'LOCAL2BRAND Engineering');

    // OpenGraph
    setMetaTag('property', 'og:title', activeTitle);
    setMetaTag('property', 'og:description', activeDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:site_name', 'LOCAL2BRAND');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', activeTitle);
    setMetaTag('name', 'twitter:description', activeDesc);
    setMetaTag('name', 'twitter:image', image);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [activeTitle, activeDesc, activeKeywords, canonicalUrl, image, type]);

  return null;
}
