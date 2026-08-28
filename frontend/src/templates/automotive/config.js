/**
 * Apex Velocity Luxury Supercars & Certified Superbikes - Production Configuration
 */
export const automotiveConfig = {
  businessName: import.meta.env.VITE_DEMO_AUTOMOTIVE_NAME || "Apex Velocity Supercars & Bikes",
  businessSubtitle: "Certified Pre-Owned Exotics, Track Superbikes & Precision Detailing",
  tagline: import.meta.env.VITE_DEMO_AUTOMOTIVE_TAGLINE || "200-Point Multipoint Diagnostic Inspection • Non-Accidental Guarantee • Pan-India Enclosed Delivery",
  city: import.meta.env.VITE_DEMO_AUTOMOTIVE_CITY || "Delhi NCR / Mumbai / Bengaluru",
  phone: import.meta.env.VITE_DEMO_AUTOMOTIVE_PHONE || "+91 98765 43221",
  whatsapp: import.meta.env.VITE_DEMO_AUTOMOTIVE_WHATSAPP || "919876543221",
  address: "Golf Course Road, DLF Phase 5, Gurugram, Haryana - 122002",
  hours: {
    weekdays: "10:00 AM - 8:30 PM",
    weekends: "10:00 AM - 7:30 PM",
    days: "Open 7 Days a Week"
  },
  heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_AUTOMOTIVE_PRIMARY_COLOR || "#f59e0b",
    accentColor: import.meta.env.VITE_DEMO_AUTOMOTIVE_ACCENT_COLOR || "#fbbf24",
    bgDark: import.meta.env.VITE_DEMO_AUTOMOTIVE_BG_COLOR || "#07090d"
  },

  activeCoupons: [
    { code: "CERAMICFREE", discountPercent: 0, minOrder: 0, label: "FREE 9H Ceramic Coating & 1-Year Extended Warranty on All Car Deliveries" }
  ],

  categories: [
    "All",
    "Supercars & Coupes",
    "Luxury SUVs",
    "Track Superbikes"
  ],

  vehicles: [
    {
      id: 1,
      name: "Porsche 911 Carrera S (992)",
      category: "Supercars & Coupes",
      year: "2024",
      kms: "4,200 km",
      fuel: "Twin-Turbo 3.0L Flat-6 (450 HP)",
      price: "₹1.85 Cr",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      specs: ["0-100 km/h in 3.5s", "Sport Chrono Package", "Bose Surround Sound", "Guards Red with Black Leather"]
    },
    {
      id: 2,
      name: "Range Rover SV Autobiography LWB",
      category: "Luxury SUVs",
      year: "2023",
      kms: "11,800 km",
      fuel: "4.4L Twin-Turbo V8 (530 HP)",
      price: "₹2.95 Cr",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
      isBestseller: true,
      specs: ["Executive Rear Lounge", "Meridian Signature 1600W Sound", "Electronic Air Suspension", "Full Clean Service History"]
    },
    {
      id: 3,
      name: "Ducati Panigale V4 S",
      category: "Track Superbikes",
      year: "2024",
      kms: "1,800 km",
      fuel: "1,103cc Desmosedici Stradale V4 (214 HP)",
      price: "₹34.50 Lakh",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop",
      isBestseller: false,
      specs: ["Öhlins Smart EC 2.0 Suspension", "Full Akrapovič Titanium Exhaust", "Brembo Stylema Calipers", "Ducati Corse Livery"]
    }
  ],

  testimonials: [
    {
      name: "Karan Singhania (Entrepreneur)",
      rating: 5,
      comment: "Purchased my Porsche 911 through Apex Velocity. Pristine condition, instant RC transfer, and VIP track day test drive!",
      date: "Purchased Last Month",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Rohan Kapoor",
      rating: 5,
      comment: "Full transparency on 200-point inspection report and zero tampering on meter reading for my Panigale V4 S.",
      date: "Purchased 2 Weeks Ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "What is covered in your 200-Point Pre-Purchase Inspection?",
      a: "Every supercar undergoes complete electronic scan of all ECUs, chassis laser geometry inspection, compression test of cylinders, suspension dynamometer test, and verified odometer history."
    },
    {
      q: "Do you facilitate luxury car financing and insurance?",
      a: "Yes! We offer up to 85% on-road funding through leading private banks (HDFC, ICICI, Kotak) with interest rates starting at 8.75% and instant 1-hour approval."
    }
  ]
};
