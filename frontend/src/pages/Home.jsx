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
import { 
  SEO_PAGES, 
  generateOrganizationSchema, 
  generateWebSiteSchema, 
  generateFAQSchema 
} from '../config/seoConfig';
import { agencyFaqs } from '../data/faqs';

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();
  const faqSchema = generateFAQSchema(agencyFaqs.slice(0, 6));

  return (
    <>
      <SEO 
        title={SEO_PAGES.home.title}
        description={SEO_PAGES.home.description}
        canonical={SEO_PAGES.home.canonical}
        schema={[organizationSchema, webSiteSchema, faqSchema].filter(Boolean)}
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
