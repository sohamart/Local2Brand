/**
 * Pricing Tiers and Feature Matrix for LOCAL2BRAND
 */

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    badge: "Fast Launch",
    popular: false,
    price: "$399",
    priceInr: "₹12,999",
    billingNote: "One-time investment",
    turnaround: "3 - 7 Days",
    description: "Ideal for local businesses, consultants, and creators looking to launch a polished online presence quickly.",
    features: [
      "Up to 5 High-Conversion Pages / Sections",
      "Choice of any Ready-Made Demo Template",
      "Full Customization (Branding, Colors, Content)",
      "100% Mobile & Tablet Responsive Layout",
      "WhatsApp Direct Ordering & Inquiry Integration",
      "Basic SEO Setup & Google Maps Location Embed",
      "14 Days Post-Launch Support & Minor Edits"
    ],
    notIncluded: [
      "Custom Complex Web App Logic",
      "Advanced Multi-level Catalog",
      "Dedicated Project Manager"
    ],
    ctaText: "Start with Starter",
    websiteType: "Starter Website"
  },
  {
    id: "professional",
    name: "Professional",
    badge: "Most Popular",
    popular: true,
    price: "$799",
    priceInr: "₹24,999",
    billingNote: "One-time investment",
    turnaround: "5 - 7 Business Days",
    description: "Our flagship custom website tier for ambitious brands who want an Apple-grade, high-converting digital experience.",
    features: [
      "Up to 12 Bespoke Pages / Dynamic Architecture",
      "Bespoke Liquid Glass UI / Custom Design System",
      "GSAP Micro-Animations & Lenis Smooth Scroll",
      "Interactive WhatsApp Order Funnel with Dynamic Messages",
      "Full On-Page Technical SEO & Schema Optimization",
      "Speed Optimization (98+ Google Lighthouse Guaranteed)",
      "Social Media Feeds & Lead Capture Integration",
      "30 Days VIP Priority Post-Launch Support"
    ],
    notIncluded: [
      "Full-stack Custom SaaS Backend (Phase 4)"
    ],
    ctaText: "Get Professional",
    websiteType: "Professional Website"
  },
  {
    id: "custom",
    name: "Custom Enterprise",
    badge: "Tailored Growth",
    popular: false,
    price: "$1,499+",
    priceInr: "₹49,999+",
    billingNote: "Scope-based pricing",
    turnaround: "10 - 15 Business Days",
    description: "Full-scale custom digital products, extensive e-commerce catalogs, and multi-location business solutions.",
    features: [
      "Unlimited Custom Pages & Modular Design Tokens",
      "Custom Component Architecture & Micro-Interactions",
      "Complete E-Commerce / Multi-Category WhatsApp Shop",
      "Interactive Calculators, Multi-Step Form Funnels",
      "Dedicated Senior UI/UX Designer & Lead Engineer",
      "Priority 24/7 WhatsApp & Strategy Call Access",
      "60 Days Dedicated Hyper-Care Support & Training",
      "Scalable code architecture ready for future Backend API"
    ],
    notIncluded: [],
    ctaText: "Discuss Custom Scope",
    websiteType: "Custom Enterprise Solution"
  }
];

export const featureMatrix = [
  {
    category: "Design & UX",
    items: [
      { name: "Liquid Glass Design Language", starter: "Standard", professional: "Premium Bespoke", custom: "Full Custom System" },
      { name: "Device Responsiveness (Mobile/Tablet/Desktop)", starter: true, professional: true, custom: true },
      { name: "Custom Micro-interactions & GSAP Motion", starter: "Subtle", professional: "Advanced", custom: "Elite Bespoke" },
      { name: "Brand Asset & Color Palette Alignment", starter: true, professional: true, custom: true }
    ]
  },
  {
    category: "Conversion & WhatsApp System",
    items: [
      { name: "Direct WhatsApp Order / Consultation Flow", starter: true, professional: true, custom: true },
      { name: "Dynamic Pre-Filled WhatsApp Message Payload", starter: true, professional: true, custom: true },
      { name: "Interactive Product / Service Selector", starter: false, professional: true, custom: true },
      { name: "Custom Lead Generation & Quote Calculators", starter: false, professional: false, custom: true }
    ]
  },
  {
    category: "Performance & Technical SEO",
    items: [
      { name: "98+ PageSpeed & Core Web Vitals Optimization", starter: true, professional: true, custom: true },
      { name: "Google Business & Structured JSON-LD Schema", starter: "Basic", professional: "Comprehensive", custom: "Advanced Full Coverage" },
      { name: "Fast Static Asset Delivery & Clean Build", starter: true, professional: true, custom: true },
      { name: "Hosting & Custom Domain Setup Assistance", starter: true, professional: true, custom: true }
    ]
  },
  {
    category: "Support & Revisions",
    items: [
      { name: "Turnaround Time", starter: "48-72h", professional: "5-7 Days", custom: "10-15 Days" },
      { name: "Revision Rounds", starter: "2 Rounds", professional: "Unlimited during build", custom: "Unlimited Priority" },
      { name: "Post-Launch Warranty & Support", starter: "14 Days", professional: "30 Days VIP", custom: "60 Days Hyper-Care" }
    ]
  }
];
