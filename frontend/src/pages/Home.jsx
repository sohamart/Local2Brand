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

export default function Home() {
  return (
    <>
      <SEO 
        title="Weblets — Lets make website together | Modern High-Performance Web Studio"
        description="Weblets (weblets.bond) builds digital experiences that turn ambitious businesses into recognized global brands. 48-Hour delivery, bespoke design systems, 12+ live commercial demo templates, and direct WhatsApp lead generation."
        keywords="weblets, weblets.bond, website development, fast website delivery, website design agency, ecommerce website builder, bespoke web agency, lets make website together"
      />
      
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Live Animated Real-Time Website Views Counter */}
        <LiveViewsCounter />

        {/* 3. Trust / Metrics Section */}
        <TrustMetrics />

        {/* 3. Services Section */}
        <ServicesOverview />

        {/* 4. Featured Work Section */}
        <FeaturedWork />

        {/* 5. Demo Showcase Section */}
        <DemoShowcase />

        {/* 6. Process Section */}
        <ProcessTimeline />

        {/* 7. Dedicated Real-Time Order & Sprint Tracker */}
        <HomeTrackOrderSection />

        {/* 8. Why LOCAL2BRAND Section */}
        <WhyUs />

        {/* 9. Testimonials Section */}
        <Testimonials />

        {/* 10. Pricing Section */}
        <PricingPreview />

        {/* 11. FAQ Section */}
        <FAQSection />

        {/* 12. Final CTA Section */}
        <FinalCTA />
      </main>
    </>
  );
}
