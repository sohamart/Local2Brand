/**
 * Ready-Made Demo Website Marketplace Dataset
 * All 12 Standalone Demo Templates with live interactive previews and direct ordering.
 * Accessible Pricing: Starter Demos @ ₹4,999 | Grand Niche Demos @ ₹14,999
 */

const env = import.meta.env || {};

const getEnvDemoConfig = (prefix) => {
  const url = env[`VITE_DEMO_${prefix}_URL`] || '';
  const statusEnv = env[`VITE_DEMO_${prefix}_STATUS`];
  // If status is specified in env, use it (published | coming_soon).
  // Defaults to coming_soon if empty or not published.
  const status = statusEnv ? statusEnv.toLowerCase() : (url ? 'published' : 'coming_soon');
  const isPublished = status === 'published' && Boolean(url);
  return { liveUrl: url, status, isPublished };
};

export const demoCategories = [
  "All",
  "Restaurant",
  "Cafe",
  "Salon",
  "Gym",
  "Hotel",
  "Real Estate",
  "Photography",
  "Boutique",
  "Coaching",
  "Dental",
  "Jewellery",
  "Automotive"
];

export const demoWebsites = [
  {
    id: "restaurant",
    slug: "restaurant",
    templateId: "restaurant",
    title: "L'Amour Gourmet Restaurant & Charcoal Grill",
    category: "Restaurant",
    badge: "Flagship",
    price: "$199",
    priceInr: "₹6,999",
    turnaround: "3 - 7 Days",
    rating: 5.0,
    reviewsCount: 84,
    ...getEnvDemoConfig("RESTAURANT"),
    shortDescription: "Fine dining restaurant & bar website with interactive live digital menu, online table reservations, and 1-click WhatsApp order dispatch.",
    description: "Designed for premium dine-in restaurants, cloud kitchens, BBQ grills, and fine dining lounges. Features categorized chef specials, dish allergens/spice indicators, table reservation system, rider dispatch integration, and instant WhatsApp food checkout.",
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Interactive Digital Menu with Veg/Non-Veg & Spice Filters",
      "Instant WhatsApp Food Ordering & Delivery Dispatch",
      "VIP Table Reservation & Event Booking System",
      "Dynamic Customer Reviews & Chef Recommendations"
    ],
    idealFor: "Fine dining restaurants, cafes, cloud kitchens, bistros & BBQ grills"
  },
  {
    id: "cafe",
    slug: "cafe",
    templateId: "cafe",
    title: "The Artisanal Roastery & Coffee Bar",
    category: "Cafe",
    badge: "Trending",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 5.0,
    reviewsCount: 36,
    ...getEnvDemoConfig("CAFE"),
    shortDescription: "Aesthetic specialty coffee bar & bakery website with single-origin brew showcase and cozy ambience tour.",
    description: "Designed for coffee roasteries, rooftop cafes, and artisanal bakeries. Includes live brew rate cards, Wi-Fi workspace highlights, and WhatsApp takeaway ordering.",
    heroImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Categorized Artisan Coffee & Pastry Showcase",
      "Rooftop & Co-working Ambience Highlights",
      "Instant WhatsApp Order & Reservation Trigger",
      "Fast 99+ PageSpeed Mobile Performance"
    ],
    idealFor: "Artisanal cafes, coffee roasters, bakeries & tea bars"
  },
  {
    id: "salon",
    slug: "salon",
    templateId: "salon",
    title: "Aura Luxe Unisex Salon & Aesthetic Spa",
    category: "Salon",
    badge: "Popular",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 4.9,
    reviewsCount: 42,
    ...getEnvDemoConfig("SALON"),
    shortDescription: "Celebrity hair styling and luxury spa website with rate cards, treatment timings, and direct stylist booking.",
    description: "Tailored for premium beauty salons, nail bars, and cosmetic clinics. Features treatment rate cards, stylist profiles, and WhatsApp appointment booking.",
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Categorized Hair, Skin & Bridal Rate Cards",
      "VIP Stylist Appointment Booking Form",
      "Before & After Glamour Showcase",
      "Soft Glass Aesthetics with Smooth Animations"
    ],
    idealFor: "Hair salons, day spas, nail artists & bridal makeup studios"
  },
  {
    id: "gym",
    slug: "gym",
    templateId: "gym",
    title: "IronCore Performance Gym & Crossfit",
    category: "Gym",
    badge: "High Energy",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 4.8,
    reviewsCount: 39,
    ...getEnvDemoConfig("GYM"),
    shortDescription: "High-intensity fitness center platform with trainer rosters, membership pass calculator, and trial passes.",
    description: "Built for gyms, CrossFit boxes, and MMA dojos. Showcases membership packages, trainer certifications, and 1-day free pass booking on WhatsApp.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Membership Tier Passes & Pricing Cards",
      "Coach & Elite Personal Trainer Rosters",
      "Instant 1-Day Trial Pass Claim on WhatsApp",
      "Dynamic Workout Schedule & Timings Table"
    ],
    idealFor: "Fitness clubs, gym chains, CrossFit centers & yoga studios"
  },
  {
    id: "hotel",
    slug: "hotel",
    templateId: "hotel",
    title: "The Grand Heritage Resort & Villa",
    category: "Hotel",
    badge: "Enterprise Suite",
    price: "$449",
    priceInr: "₹14,999",
    turnaround: "72 Hours",
    rating: 5.0,
    reviewsCount: 54,
    ...getEnvDemoConfig("HOTEL"),
    shortDescription: "Ultra-luxury hotel & resort platform with room inventory tours, tariff cards, and concierge booking.",
    description: "Designed for boutique heritage hotels, luxury mountain resorts, and private pool villas. Includes suite amenity tours, seasonal packages, and VIP WhatsApp concierge.",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Filterable Presidential & Suite Room Inventory",
      "Interactive WhatsApp Date & Guest Booking Flow",
      "Resort Amenities & Dining Experiences Gallery",
      "Full Concierge & Airport Transfer Inquiries"
    ],
    idealFor: "Resorts, boutique hotels, luxury villas & homestays"
  },
  {
    id: "realestate",
    slug: "realestate",
    templateId: "realestate",
    title: "Skyline Crown Luxury Properties & Villas",
    category: "Real Estate",
    badge: "Enterprise Suite",
    price: "$449",
    priceInr: "₹14,999",
    turnaround: "72 Hours",
    rating: 4.9,
    reviewsCount: 31,
    ...getEnvDemoConfig("REALESTATE"),
    shortDescription: "High-ticket real estate brokerage platform with property listings, floor plans, and VIP site visit booking.",
    description: "Built for luxury real estate developers, property brokers, and gated communities. Features square-footage breakdowns, EMI calculators, and instant site visit schedules.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Property Listings with BHK, Sq.ft & Price Filters",
      "Interactive Site Visit & Brochure WhatsApp Download",
      "Interactive Location Map & Nearby Connectivity Matrix",
      "Lead Capture Modal with Instant WhatsApp Dispatch"
    ],
    idealFor: "Real estate brokers, builders, luxury property developers & architects"
  },
  {
    id: "photography",
    slug: "photography",
    templateId: "photography",
    title: "Lumière Cine & Destination Wedding Studio",
    category: "Photography",
    badge: "Creative",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 4.9,
    reviewsCount: 29,
    ...getEnvDemoConfig("PHOTOGRAPHY"),
    shortDescription: "Cinematic photography portfolio with masonry gallery, client films, and destination wedding quote generator.",
    description: "Crafted for wedding cinematographers, editorial fashion photographers, and creative studios. Features full-bleed portfolios, equipment showcases, and WhatsApp booking.",
    heroImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Masonry Visual Portfolio with Fullscreen Lightbox",
      "Pre-Wedding, Destination & Portrait Packages",
      "Instant Date Check & Custom Quote on WhatsApp",
      "Client Testimonials & Published Magazine Badges"
    ],
    idealFor: "Wedding photographers, commercial studios, filmmakers & artists"
  },
  {
    id: "boutique",
    slug: "boutique",
    templateId: "boutique",
    title: "Vogue Sutra Handcrafted Ethnic & Couture",
    category: "Boutique",
    badge: "Retail Ready",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 5.0,
    reviewsCount: 47,
    ...getEnvDemoConfig("BOUTIQUE"),
    shortDescription: "High-end fashion boutique store with lookbooks, seasonal drops, fabric stories, and WhatsApp checkout.",
    description: "Designed for designer fashion labels, handcrafted ethnic boutiques, and artisanal jewellery brands. Features size charts, catalog filtering, and 1-click WhatsApp cart.",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Seasonal Couture Catalog with Price & Fabric Tags",
      "1-Click WhatsApp Direct Buy & Custom Sizing Chat",
      "Fabric Craftsmanship & Sustainable Heritage Story",
      "Customer Reviews with Photo Gallery Highlights"
    ],
    idealFor: "Fashion boutiques, ethnic wear studios, jewelry shops & footwear"
  },
  {
    id: "coaching",
    slug: "coaching",
    templateId: "coaching",
    title: "Apex Horizon Academy & Premier EdTech",
    category: "Coaching",
    badge: "High Growth",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 4.9,
    reviewsCount: 52,
    ...getEnvDemoConfig("COACHING"),
    shortDescription: "Premier coaching institute website with batch curriculum, mentor profiles, and WhatsApp demo class booking.",
    description: "Designed for competitive exam institutes (JEE/NEET/UPSC), coding bootcamps, and executive coaching. Features ranker leaderboards, batch schedules, and WhatsApp registration.",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Interactive Course Curriculum & Fee Breakdown",
      "Free 3-Day Trial Class Registration via WhatsApp",
      "Top Rankers Wall of Fame & Success Stories",
      "Faculty Credentials & Video Lecture Highlights"
    ],
    idealFor: "Coaching institutes, EdTech startups, language tutors & exam academies"
  },
  {
    id: "dental",
    slug: "dental",
    templateId: "dental",
    title: "Apex Care Multispeciality Dental & Implant Clinic",
    category: "Dental",
    badge: "Healthcare",
    price: "$149",
    priceInr: "₹4,999",
    turnaround: "3 - 7 Days",
    rating: 5.0,
    reviewsCount: 61,
    ...getEnvDemoConfig("DENTAL"),
    shortDescription: "Modern medical & dental clinic website with doctor credentials, procedure rate cards, and appointment slots.",
    description: "Built for dental surgeons, polyclinics, and wellness practitioners. Features treatment guides, doctor accreditations, painless dentistry highlights, and WhatsApp appointments.",
    heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Transparent Treatment Price & Procedure Guides",
      "Doctor Credentials, BDS/MDS Degrees & Badges",
      "1-Click WhatsApp Doctor Appointment Booking",
      "Hygiene & Sterilization Safety Protocols Matrix"
    ],
    idealFor: "Dental clinics, medical doctors, physiotherapy centers & diagnostic labs"
  },
  {
    id: "jewellery",
    slug: "jewellery",
    templateId: "jewellery",
    title: "Aurum Royal Solitaires & 22K Gold Atelier",
    category: "Jewellery",
    badge: "Enterprise Suite",
    price: "$449",
    priceInr: "₹14,999",
    turnaround: "72 Hours",
    rating: 5.0,
    reviewsCount: 38,
    ...getEnvDemoConfig("JEWELLERY"),
    shortDescription: "Ultra-luxury jewellery atelier website with certified gold/diamond showcase, hallmark guarantee, and VIP consultation.",
    description: "Designed for gold ateliers, diamond houses, and bridal jewellery showrooms. Features purity certifications, live gold rate ticker, virtual try-on booking, and WhatsApp sales.",
    heroImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Hallmarked 22K & Solitaire Diamond Collections",
      "Live Gold Rate Indicator & Transparency Calculator",
      "VIP Private Showroom Appointment Booking",
      "BIS 916 Hallmark & Certified Diamond Badges"
    ],
    idealFor: "Fine jewellery showrooms, gold merchants, diamond ateliers & bridal luxury"
  },
  {
    id: "automotive",
    slug: "automotive",
    templateId: "automotive",
    title: "Apex Velocity Supercars & Luxury Auto Showroom",
    category: "Automotive",
    badge: "Enterprise Suite",
    price: "$449",
    priceInr: "₹14,999",
    turnaround: "72 Hours",
    rating: 4.9,
    reviewsCount: 33,
    ...getEnvDemoConfig("AUTOMOTIVE"),
    shortDescription: "Exotic supercar showroom & auto detailing platform with vehicle specs, financing calculator, and VIP test drive booking.",
    description: "Built for luxury pre-owned car showrooms, ceramic coating studios, and motorcycle dealerships. Features HP/0-100 specs, EMI estimates, and WhatsApp test drive scheduling.",
    heroImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1400&auto=format&fit=crop",
    features: [
      "Vehicle Fleet with BHP, Top Speed & Specs Comparison",
      "Instant WhatsApp VIP Test Drive Booking Flow",
      "Ceramic Coating & PPF Protection Packages",
      "EMI Estimation & Trade-In Evaluation Forms"
    ],
    idealFor: "Luxury car dealerships, ceramic coating studios, supercar brokers & auto garages"
  }
];

export const getDemoBySlug = (slug) => {
  return demoWebsites.find(
    (demo) =>
      demo.slug?.toLowerCase() === slug?.toLowerCase() ||
      demo.templateId?.toLowerCase() === slug?.toLowerCase() ||
      demo.id?.toLowerCase() === slug?.toLowerCase()
  );
};


