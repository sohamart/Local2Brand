/**
 * Ready-Made Demo Website Marketplace Dataset
 * Designed for immediate client previews, device testing, and WhatsApp ordering.
 */

export const demoCategories = [
  "All",
  "Restaurant",
  "Salon",
  "Agency",
  "Portfolio",
  "Real Estate",
  "E-commerce",
  "Startup",
  "Local Business",
  "Personal Brand"
];

export const demoWebsites = [
  {
    id: "gourmet-bistro",
    slug: "gourmet-bistro",
    title: "Gourmet Bistro & Fine Dining",
    category: "Restaurant",
    badge: "Best Seller",
    price: "$399 / ₹12,999",
    turnaround: "48 Hours",
    rating: 4.9,
    reviewsCount: 38,
    shortDescription: "Sleek dining and culinary experience template with interactive digital menu, table booking triggers, and ambient visuals.",
    description: "An ultra-premium restaurant & café experience crafted for high-end dining spots, gourmet bistros, and cloud kitchens. Includes QR digital menus, reservation inquiry system, Instagram gallery feeds, and Google Maps integration.",
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Dynamic Filterable Food & Drinks Menu with dietary tags",
      "One-click Table Booking via WhatsApp / Call",
      "Live Location, Open Hours & Google Reviews Integration",
      "Mobile-First Responsive Layout with 99+ PageSpeed",
      "SEO schema optimized for 'Best Restaurant Near Me'"
    ],
    technologies: ["React", "Tailwind CSS", "Lucide Icons", "Lenis Scroll", "WhatsApp Order"],
    idealFor: "Fine dining restaurants, cafés, microbreweries, bakeries & cloud kitchens"
  },
  {
    id: "luxe-salon-spa",
    slug: "luxe-salon-spa",
    title: "Aura Luxe Salon & Aesthetic Spa",
    category: "Salon",
    badge: "Trending",
    price: "$449 / ₹14,999",
    turnaround: "48 Hours",
    rating: 5.0,
    reviewsCount: 42,
    shortDescription: "Elegant aesthetic salon, wellness spa, and hair styling studio website with service menus and appointment booking.",
    description: "Designed for premium beauty salons, wellness clinics, nail bars, and cosmetic studios. Features aesthetic soft-blur glass aesthetics, service price list with durations, stylist profiles, and WhatsApp booking triggers.",
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Categorized Treatment & Styling Rate Cards",
      "Direct WhatsApp Stylist Appointment booking",
      "Before/After Transformation Gallery Showcase",
      "Customer Testimonials & VIP Membership cards",
      "Fast loading on mobile with touch-friendly navigation"
    ],
    technologies: ["React", "Tailwind CSS", "Framer Motion", "WhatsApp Engine"],
    idealFor: "Hair salons, day spas, nail artists, skin clinics & bridal studios"
  },
  {
    id: "nexus-creative-agency",
    slug: "nexus-creative-agency",
    title: "Nexus Digital Studio & Agency",
    category: "Agency",
    badge: "Featured",
    price: "$599 / ₹19,999",
    turnaround: "3-4 Days",
    rating: 4.9,
    reviewsCount: 56,
    shortDescription: "Ultra-modern agency portfolio with case studies, client logos, dynamic pricing, and lead generation funnels.",
    description: "Engineered for marketing agencies, UI/UX design firms, and video production houses looking to establish credibility and close high-ticket clients with interactive case studies and smooth kinetic animations.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Interactive Case Studies with KPI metrics & live deliverables",
      "Service Capabilities Breakdown with interactive tabs",
      "High-converting Client Inquiry & Project Estimator",
      "Team Showcase and Global Client Proof Marquee",
      "Liquid glass design language with custom cursor effects"
    ],
    technologies: ["React", "GSAP ScrollTrigger", "Tailwind CSS", "Lenis Smooth Scroll"],
    idealFor: "Creative agencies, dev shops, video studios, PR firms & consultancies"
  },
  {
    id: "elysian-real-estate",
    slug: "elysian-real-estate",
    title: "Elysian Prime Realty & Estates",
    category: "Real Estate",
    badge: "High Conversion",
    price: "$649 / ₹21,999",
    turnaround: "3-5 Days",
    rating: 4.8,
    reviewsCount: 29,
    shortDescription: "Sophisticated luxury real estate showcase with property listings, amenity tours, and instant broker inquiries.",
    description: "Tailor-made for real estate developers, property brokers, villa rentals, and luxury residential projects. Features interactive property filters, floor plan viewports, virtual tour CTAs, and instant WhatsApp brochure downloads.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Filter properties by location, bedrooms, budget & category",
      "High-res architectural photo gallery & floor plan viewer",
      "WhatsApp 'Book a Site Visit' instant scheduling trigger",
      "Mortgage/EMI Estimation Calculator widget",
      "Neighborhood & nearby landmarks interactive map section"
    ],
    technologies: ["React", "Tailwind CSS", "Lucide Icons", "WhatsApp Integration"],
    idealFor: "Real estate agents, property developers, luxury villa rentals & brokers"
  },
  {
    id: "artisanal-ecommerce",
    slug: "artisanal-ecommerce",
    title: "Velour Artisanal Store & Catalog",
    category: "E-commerce",
    badge: "Popular",
    price: "$549 / ₹18,999",
    turnaround: "3-4 Days",
    rating: 4.9,
    reviewsCount: 47,
    shortDescription: "Modern boutique product catalog with WhatsApp direct order checkout, category tabs, and product zoom.",
    description: "Perfect for direct-to-consumer (D2C) brands, apparel boutiques, organic skincare, and handcrafted goods. Customers browse items and complete orders directly via WhatsApp with auto-calculated totals.",
    heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Product Catalog with variant selectors (sizes, colors, scents)",
      "WhatsApp Cart & Direct Order Generation",
      "Customer Trust Badges, Returns Policy & Shipping Info",
      "Instagram Feed and Customer Review UGC section",
      "Speed-optimized for zero customer drop-off on mobile"
    ],
    technologies: ["React", "Tailwind CSS", "WhatsApp Cart Engine", "GSAP"],
    idealFor: "D2C brands, fashion boutiques, handcrafted gifts, cosmetics & home decor"
  },
  {
    id: "saas-launchpad-startup",
    slug: "saas-launchpad-startup",
    title: "Pulse SaaS & Tech Startup",
    category: "Startup",
    badge: "Tech Favorite",
    price: "$699 / ₹23,999",
    turnaround: "3-5 Days",
    rating: 5.0,
    reviewsCount: 34,
    shortDescription: "High-conversion tech startup landing page with feature bento grid, interactive pricing, and product demo widgets.",
    description: "Designed for SaaS products, AI startups, fintech apps, and B2B platforms. Highlights software benefits using Apple-inspired bento grids, interactive product demos, ROI calculators, and lead capture funnels.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Futuristic Bento Box UI highlighting key features",
      "Interactive Monthly/Annual pricing switcher",
      "Product comparison table & feature breakdown",
      "Security compliance & enterprise trust seals",
      "Waitlist / Demo request routing directly to WhatsApp"
    ],
    technologies: ["React", "Tailwind CSS", "GSAP", "Bento UI System"],
    idealFor: "Software startups, mobile apps, AI tools, fintech & tech founders"
  },
  {
    id: "vertex-architects",
    slug: "vertex-architects",
    title: "Vertex Architecture & Interior Studio",
    category: "Portfolio",
    badge: "Minimalist",
    price: "$499 / ₹16,999",
    turnaround: "48-72 Hours",
    rating: 4.9,
    reviewsCount: 22,
    shortDescription: "Editorial-style showcase for architects, interior designers, and visual creators with full-bleed image galleries.",
    description: "Clean, gallery-grade portfolio website with expansive typography, horizontal scroll projects, before/after architectural sliders, and client consultation bookings.",
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "High-res Full Bleed Portfolio Showcase with lightbox",
      "Interactive Project Specs (Area, Year, Materials, Location)",
      "Consultation Inquiry form connected to WhatsApp",
      "Awards & Publications editorial grid",
      "Smooth Lenis inertia scrolling"
    ],
    technologies: ["React", "Tailwind CSS", "Lenis", "Lightbox Gallery"],
    idealFor: "Architects, interior designers, photographers, landscape studios"
  },
  {
    id: "apex-fitness-studio",
    slug: "apex-fitness-studio",
    title: "Apex Performance & Fitness Club",
    category: "Local Business",
    badge: "High Energy",
    price: "$449 / ₹14,999",
    turnaround: "48 Hours",
    rating: 4.8,
    reviewsCount: 31,
    shortDescription: "High-impact local gym, CrossFit, or yoga studio website with class schedules, trainer profiles, and free trial pass booking.",
    description: "Built for local fitness clubs, personal trainers, and martial arts academies looking to convert neighborhood residents into paying members with instant trial booking and schedule tables.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Interactive Weekly Class Timetable & Schedule",
      "1-Click 'Claim Free 1-Day Pass' WhatsApp trigger",
      "Trainer & Coach Profiles with certifications",
      "Membership Tier pricing breakdown",
      "Location map & neighborhood directions"
    ],
    technologies: ["React", "Tailwind CSS", "Lucide Icons", "WhatsApp Funnel"],
    idealFor: "Gyms, CrossFit boxes, yoga studios, Pilates clinics, sports academies"
  },
  {
    id: "clara-consulting",
    slug: "clara-consulting",
    title: "Dr. Elena Vance — Executive Coaching",
    category: "Personal Brand",
    badge: "Authority",
    price: "$499 / ₹16,999",
    turnaround: "48 Hours",
    rating: 5.0,
    reviewsCount: 19,
    shortDescription: "Authority-building personal brand site for consultants, keynote speakers, doctors, and executive coaches.",
    description: "Establish elite credibility with a bespoke personal website. Features featured keynote clips, published books, podcast mentions, client testimonials, and 1-on-1 strategy call booking.",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1400&auto=format&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
      "Keynote speaking and consulting package breakdown",
      "Direct WhatsApp strategy session booking link",
      "Media & Press logos (Forbes, TEDx, Bloomberg styling)",
      "Newsletter / Lead magnet download trigger",
      "Editorial blog / articles reader layout"
    ],
    technologies: ["React", "Tailwind CSS", "Glassmorphic Elements", "WhatsApp API"],
    idealFor: "Consultants, doctors, keynote speakers, authors & C-suite executives"
  }
];

export function getDemoBySlug(slug) {
  return demoWebsites.find((item) => item.slug === slug || item.id === slug) || null;
}
