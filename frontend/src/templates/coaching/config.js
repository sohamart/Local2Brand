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
  hours: "Mon - Sat: 8:00 AM - 8:00 PM",
  heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",

  batches: [
    {
      id: 1,
      name: "Super 30 IIT-JEE Advanced Batch",
      target: "Class 11, 12 & Droppers",
      duration: "1-2 Year Intensive Program",
      fee: "₹85,000 / Year",
      features: ["Taught by Top 100 IITian Mentors", "Daily 4-Hour Live Problem Solving", "All India Test Series (CBT Computer Mode)", "1-on-1 Personal Doubt Clearance"],
      popular: true
    },
    {
      id: 2,
      name: "NEET Medical Achievers Batch",
      target: "Class 11, 12 & Repeaters",
      duration: "1-2 Year Full Medical Program",
      fee: "₹75,000 / Year",
      features: ["NCERT Line-by-Line Mastery", "30,000+ Question Bank with Video Solutions", "Weekly OMR-Based Mock Simulations", "Biology Diagram Memory Workshops"],
      popular: false
    },
    {
      id: 3,
      name: "Olympiad & NTSE Junior Foundation",
      target: "Class 8, 9 & 10 Students",
      duration: "Weekend & Evening Hybrid",
      fee: "₹42,000 / Year",
      features: ["Early High-School Science & Math Lead", "Mental Ability & Logical Reasoning", "School Boards + Competitive Sync"],
      popular: false
    }
  ]
};
