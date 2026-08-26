import React from 'react';
import Hero from '../components/home/Hero';
import TrustMetrics from '../components/home/TrustMetrics';
import ServicesOverview from '../components/home/ServicesOverview';
import FeaturedWork from '../components/home/FeaturedWork';
import DemoShowcase from '../components/home/DemoShowcase';
import ProcessTimeline from '../components/home/ProcessTimeline';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import PricingPreview from '../components/home/PricingPreview';
import FAQSection from '../components/home/FAQSection';
import FinalCTA from '../components/home/FinalCTA';
import { SEO } from '../components/common/CommonUI';

export default function Home() {
  return (
    <>
      <SEO 
        title="We Build Digital Experiences That Turn Local Brands Into Big Brands"
        description="Premium digital agency crafting high-converting websites, liquid glass UI designs, and ready-made demo templates with direct WhatsApp ordering."
      />
      
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust / Metrics Section */}
        <TrustMetrics />

        {/* 3. Services Section */}
        <ServicesOverview />

        {/* 4. Featured Work Section */}
        <FeaturedWork />

        {/* 5. Demo Showcase Section */}
        <DemoShowcase />

        {/* 6. Process Section */}
        <ProcessTimeline />

        {/* 7. Why LOCAL2BRAND Section */}
        <WhyUs />

        {/* 8. Testimonials Section */}
        <Testimonials />

        {/* 9. Pricing Section */}
        <PricingPreview />

        {/* 10. FAQ Section */}
        <FAQSection />

        {/* 11. Final CTA Section */}
        <FinalCTA />
      </main>
    </>
  );
}
