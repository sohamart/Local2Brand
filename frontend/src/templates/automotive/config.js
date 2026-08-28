/**
 * SpeedShift Performance Motors & Luxury Superbikes - Production Configuration
 */
export const automotiveConfig = {
  businessName: import.meta.env.VITE_DEMO_AUTOMOTIVE_NAME || "SpeedShift Luxury Motors & Superbikes",
  businessSubtitle: "Certified Pre-Owned Supercars, Performance Bikes & Detailing",
  tagline: import.meta.env.VITE_DEMO_AUTOMOTIVE_TAGLINE || "200-Point Non-Accidental Certified • Comprehensive Warranty • VIP Track Test Drives",
  city: import.meta.env.VITE_DEMO_AUTOMOTIVE_CITY || "Gurugram / Mumbai / Bengaluru",
  phone: import.meta.env.VITE_DEMO_AUTOMOTIVE_PHONE || "+91 98765 43221",
  whatsapp: import.meta.env.VITE_DEMO_AUTOMOTIVE_WHATSAPP || "919876543221",
  address: "Golf Course Extension Road, Sector 65, Gurugram - 122018",
  hours: "Mon - Sun: 10:00 AM - 8:30 PM",
  heroImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop",

  inventory: [
    {
      id: 1,
      name: "Porsche 911 Carrera S (992)",
      year: "2023 Model",
      price: "₹1.72 Cr",
      specs: "3.0L Twin-Turbo Flat-6 • 443 HP • 0-100 in 3.5s",
      mileage: "11,500 KM • Single Owner",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop",
      highlights: ["Sport Chrono Package", "Bose 3D Surround Sound", "Guards Red with Full Body PPF", "200-Point Certified Clear Title"]
    },
    {
      id: 2,
      name: "Ducati Panigale V4 S",
      year: "2024 Model",
      price: "₹29.5 Lakh",
      specs: "1,103cc Desmosedici Stradale • 215 HP • Öhlins Smart EC 2.0",
      mileage: "2,800 KM • Pristine Condition",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop",
      highlights: ["Akrapovič Full Titanium Exhaust", "Ducati Quick Shift EVO 2", "Cornering ABS & Traction Control"]
    },
    {
      id: 3,
      name: "Mercedes-AMG G 63 (Night Edition)",
      year: "2023 Model",
      price: "₹3.15 Cr",
      specs: "4.0L V8 Biturbo • 577 HP • 9G-Tronic AMG Speedshift",
      mileage: "14,200 KM • Matt Black",
      image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=600&auto=format&fit=crop",
      highlights: ["AMG Carbon Fiber Package", "Burmester High-End 3D Sound", "22-inch Forged Cross-Spoke Wheels"]
    }
  ]
};
