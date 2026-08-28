/**
 * IronCore Performance Gym & Crossfit - Production Configuration
 */
export const gymConfig = {
  businessName: import.meta.env.VITE_DEMO_GYM_NAME || "IronCore Performance Gym",
  businessSubtitle: "Heavy Strength, Olympic Lifting & Crossfit Box",
  tagline: import.meta.env.VITE_DEMO_GYM_TAGLINE || "Certified Biomechanics Coaching • Imported Rogue Equipment • Steam, Sauna & Recovery",
  city: import.meta.env.VITE_DEMO_GYM_CITY || "Pune / Bengaluru / Mumbai",
  phone: import.meta.env.VITE_DEMO_GYM_PHONE || "+91 98765 43213",
  whatsapp: import.meta.env.VITE_DEMO_GYM_WHATSAPP || "919876543213",
  address: "Koregaon Park Main Road, Next to Gold Cinema, Pune - 411001",
  landmark: "10,000 sq.ft Dual Floor Facility with Dedicated Turf Area",
  hours: "Mon - Sat: 5:30 AM - 10:30 PM | Sun: 7:00 AM - 2:00 PM",
  heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",

  activeCoupons: [
    { code: "TRANSFORM20", discountPercent: 20, minOrder: 10000, label: "20% OFF on Annual Elite Transformation Plan" }
  ],

  plans: [
    {
      id: 1,
      name: "Quarterly Pro Fitness",
      duration: "3 Months",
      price: 6999,
      features: ["Full Strength & Cardio Floor Access", "Locker, Steam & Shower Facilities", "Body Composition Assessment", "Customized Workout Routine"],
      popular: false
    },
    {
      id: 2,
      name: "Annual Elite Transformation",
      duration: "12 Months",
      price: 16999,
      features: ["Unlimited 24/7 Floor Access", "12 Free 1-on-1 Personal Training Sessions", "Crossfit & HIIT Group Classes Access", "Monthly InBody 570 Composition Tracking", "Complimentary IronCore Duffel Bag & Shaker"],
      popular: true
    },
    {
      id: 3,
      name: "Half-Year Strength Pass",
      duration: "6 Months",
      price: 11499,
      features: ["Full Strength & Cardio Access", "Steam, Sauna & Ice Bath Recovery", "4 Free PT Sessions with Master Coach", "Custom Macros Nutrition Guidance"],
      popular: false
    }
  ],

  trainers: [
    {
      name: "Vikram Chauhan (Head Coach)",
      specialty: "Powerlifting & Hypertrophy",
      experience: "8+ Years • IFBB Certified",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Kavya Deshmukh",
      specialty: "Crossfit & Functional Mobility",
      experience: "6+ Years • CrossFit Level 2 Trainer",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=300&auto=format&fit=crop"
    }
  ]
};
