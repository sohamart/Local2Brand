import React from 'react';
import Hero from '../components/home/Hero';
import LiveViewsCounter from '../components/home/LiveViewsCounter';
import TrustMetrics from '../components/home/TrustMetrics';
import ServicesOverview from '../components/home/ServicesOverview';
import FeaturedWork from '../components/home/FeaturedWork';
import DemoShowcase from '../components/home/DemoShowcase';
import ProcessTimeline from '../components/home/ProcessTimeline';
import HomeTrackOrderSection from '../components/home/HomeTrackOrderSection';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import PricingPreview from '../components/home/PricingPreview';
import FAQSection from '../components/home/FAQSection';
import FinalCTA from '../components/home/FinalCTA';
import { SEO } from '../components/common/CommonUI';
import { SEO_PAGES, BRAND } from '../config/seoConfig';
import { agencyFaqs } from '../data/faqs';

export default function Home() {
  // Generate FAQ schema for homepage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: agencyFaqs.slice(0, 6).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BRAND.domain}/#organization`,
    name: BRAND.name,
    legalName: BRAND.legalName,
    alternateName: BRAND.alternateNames,
    url: BRAND.domain,
    logo: BRAND.logo,
    image: BRAND.logo,
    description: BRAND.description,
    priceRange: BRAND.priceRange,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      '@type': 'PostalAddress',
      ...BRAND.address
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BRAND.geo.latitude,
      longitude: BRAND.geo.longitude
    },
    slogan: 'lets make website together',
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'United Arab Emirates' }
    ],
    knowsAbout: [
      'Bespoke Web Development',
      'UI/UX Design',
      'Custom E-Commerce Stores',
      'React & Node.js Engineering',
      'High-Converting Landing Pages',
      'WhatsApp Order Automation'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.98',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: BRAND.socials,
    founder: BRAND.founders.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.jobTitle,
      url: f.url
    }))
  };

  return (
    <>
      <SEO 
        title={SEO_PAGES.home.title}
        description={SEO_PAGES.home.description}
        canonical={SEO_PAGES.home.canonical}
        schema={[organizationSchema, faqSchema]}
      />
      
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Live Animated Real-Time Website Views Counter */}
        <LiveViewsCounter />

        {/* 3. Trust / Metrics Section */}
        <TrustMetrics />

        {/* 4. Services Section */}
        <ServicesOverview />

        {/* 5. Featured Work Section */}
        <FeaturedWork />

        {/* 6. Demo Showcase Section */}
        <DemoShowcase />

        {/* 7. Process Section */}
        <ProcessTimeline />

        {/* 8. Dedicated Real-Time Order & Sprint Tracker */}
        <HomeTrackOrderSection />

        {/* 9. Why Weblets Section */}
        <WhyUs />

        {/* 10. Testimonials Section */}
        <Testimonials />

        {/* 11. Pricing Section */}
        <PricingPreview />

        {/* 12. FAQ Section */}
        <FAQSection />

        {/* 13. Final CTA Section */}
        <FinalCTA />
      </main>
    </>
  );
}
