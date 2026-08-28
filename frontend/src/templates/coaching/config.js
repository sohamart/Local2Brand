/**
 * Apex IIT-JEE & NEET Premier Academy - Production Configuration
 */
export const coachingConfig = {
  businessName: import.meta.env.VITE_DEMO_COACHING_NAME || "Apex Premier Academy",
  businessSubtitle: "IIT-JEE (Adv), NEET-UG & Olympiad Foundation",
  tagline: import.meta.env.VITE_DEMO_COACHING_TAGLINE || "Kota Ex-Faculty Mentorship • Daily DPPs & AI Test Analytics • 84% Selection Ratio in 2025",
  city: import.meta.env.VITE_DEMO_COACHING_CITY || "Kota / Hyderabad / Delhi",
  phone: import.meta.env.VITE_DEMO_COACHING_PHONE || "+91 98765 43218",
  whatsapp: import.meta.env.VITE_DEMO_COACHING_WHATSAPP || "919876543218",
  address: "Apex Knowledge Tower, Rajiv Gandhi Nagar, Kota, Rajasthan - 324005",
  hours: {
    weekdays: "8:00 AM - 8:00 PM",
    weekends: "8:00 AM - 6:00 PM",
    days: "Counselling Open 7 Days"
  },
  heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_COACHING_PRIMARY_COLOR || "#2563eb",
    accentColor: import.meta.env.VITE_DEMO_COACHING_ACCENT_COLOR || "#60a5fa",
    bgDark: import.meta.env.VITE_DEMO_COACHING_BG_COLOR || "#070e18"
  },

  activeCoupons: [
    { code: "SCHOLAR90", discountPercent: 15, minOrder: 40000, label: "Up to 90% Scholarship via National Admission Test" }
  ],

  categories: [
    "All",
    "IIT-JEE Advanced",
    "NEET-UG Medical",
    "Junior Foundation"
  ],

  batches: [
    {
      id: 1,
      name: "Super 30 IIT-JEE Advanced Batch",
      category: "IIT-JEE Advanced",
      target: "Class 11, 12 & Droppers",
      duration: "1-2 Year Intensive Program",
      fee: "₹85,000 / Year",
      features: ["Taught by Top 100 IITian Mentors", "Daily 4-Hour Live Problem Solving", "All India Test Series (CBT Computer Mode)", "1-on-1 Personal Doubt Clearance"],
      popular: true
    },
    {
      id: 2,
      name: "NEET Medical Achievers Batch",
      category: "NEET-UG Medical",
      target: "Class 11, 12 & Repeaters",
      duration: "1-2 Year Full Medical Program",
      fee: "₹75,000 / Year",
      features: ["NCERT Line-by-Line Mastery", "30,000+ Question Bank with Video Solutions", "Weekly OMR-Based Mock Simulations", "Biology Diagram Memory Workshops"],
      popular: false
    },
    {
      id: 3,
      name: "Olympiad & NTSE Junior Foundation",
      category: "Junior Foundation",
      target: "Class 8, 9 & 10 Students",
      duration: "Weekend & Evening Hybrid",
      fee: "₹42,000 / Year",
      features: ["Early High-School Science & Math Lead", "Mental Ability & Logical Reasoning", "School Boards + Competitive Sync"],
      popular: false
    }
  ],

  testimonials: [
    {
      name: "Aman Agarwal (AIR 48 - JEE Advanced 2025)",
      rating: 5,
      comment: "The daily problem sets and personalized doubt solving sessions by Kota ex-faculty helped me crack IIT Bombay CSE!",
      date: "IIT Bombay Batch 2025",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Priya Sharma (AIR 112 - NEET 2025)",
      rating: 5,
      comment: "Apex's NCERT biology line-by-line memory drills and AI analytics were the biggest game changers for my 705/720 score.",
      date: "AIIMS Delhi Batch 2025",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "How does the 3-Day Free Demo Class work?",
      a: "Students can attend 3 full live interactive lectures in Physics, Chemistry, and Math/Biology, receive free DPP booklets, and interact with senior HODs before paying any fees."
    },
    {
      q: "Is hostel and mess accommodation provided in Kota?",
      a: "Yes, we have verified AC boys & girls hostels with bio-metric security, hygienic nutritious food, and 24/7 warden supervision within 500m of the campus."
    }
  ]
};
