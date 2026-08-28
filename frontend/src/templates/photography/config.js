/**
 * Lumiere Studios Wedding Photography & Cinematography - Production Configuration
 */
export const photographyConfig = {
  businessName: import.meta.env.VITE_DEMO_PHOTOGRAPHY_NAME || "Lumiere Cinematic Studios",
  businessSubtitle: "Destination Wedding Photography & 4K Cinema Films",
  tagline: import.meta.env.VITE_DEMO_PHOTOGRAPHY_TAGLINE || "Over 250+ Grand Weddings Documented Worldwide • Sony FX3 4K Cinema • Vogue & WedMeGood Featured",
  city: import.meta.env.VITE_DEMO_PHOTOGRAPHY_CITY || "Goa / Udaipur / Mumbai",
  phone: import.meta.env.VITE_DEMO_PHOTOGRAPHY_PHONE || "+91 98765 43216",
  whatsapp: import.meta.env.VITE_DEMO_PHOTOGRAPHY_WHATSAPP || "919876543216",
  address: "Studio Lumiere, Film City Road, Goregaon East, Mumbai - 400065",
  hours: {
    weekdays: "10:00 AM - 8:00 PM",
    weekends: "10:00 AM - 7:00 PM",
    days: "Appointments Recommended"
  },
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
  theme: {
    primaryColor: import.meta.env.VITE_DEMO_PHOTOGRAPHY_PRIMARY_COLOR || "#f43f5e",
    accentColor: import.meta.env.VITE_DEMO_PHOTOGRAPHY_ACCENT_COLOR || "#fb7185",
    bgDark: import.meta.env.VITE_DEMO_PHOTOGRAPHY_BG_COLOR || "#070709"
  },

  activeCoupons: [
    { code: "EARLYBIRD20", discountPercent: 20, minOrder: 150000, label: "20% OFF on 2026-27 Wedding Dates Booked 3 Months in Advance" }
  ],

  categories: [
    "All",
    "Destination Wedding",
    "Pre-Wedding Films",
    "Intimate Ceremonies"
  ],

  packages: [
    {
      id: 1,
      name: "The Royal 3-Day Destination Wedding",
      category: "Destination Wedding",
      price: 280000,
      days: "3 Days Full Coverage",
      deliverables: ["4K Cinematic Wedding Film (12-15 Mins)", "1-Minute Instagram Teaser in 48 Hours", "600+ Color Graded Hi-Res Photos", "Drone Aerial Cinematography", "2 Premium Velvet Flushmount Albums"],
      popular: true
    },
    {
      id: 2,
      name: "Pre-Wedding Cinematic Storybook",
      category: "Pre-Wedding Films",
      price: 65000,
      days: "1-2 Days Outdoor Shoot",
      deliverables: ["Concept Pre-Wedding Story Film (3 Mins)", "60 Fine-Art Retouched Portraits", "Drone Footage & 3 Outfit Changes", "Hair & Makeup Stylist Included"],
      popular: false
    },
    {
      id: 3,
      name: "Classic 2-Day Wedding Essentials",
      category: "Intimate Ceremonies",
      price: 160000,
      days: "2 Days Coverage",
      deliverables: ["Traditional & Candid Photography", "Full HD Wedding Highlight Reel", "350+ Retouched Photos", "1 Coffee Table Photobook"],
      popular: false
    }
  ],

  testimonials: [
    {
      name: "Devika & Armaan (Udaipur Wedding)",
      rating: 5,
      comment: "Lumiere turned our wedding into a Bollywood dream! The 4K cinema film brought tears to everyone's eyes. Worth every single rupee.",
      date: "Wedding in Jan 2026",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Pooja & Sameer (Goa Beach Wedding)",
      rating: 5,
      comment: "Super professional team. They captured natural candid moments without making us feel awkward or staging artificial poses.",
      date: "Wedding in Dec 2025",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    }
  ],

  faqs: [
    {
      q: "What is your team size and equipment setup for weddings?",
      a: "Our destination team consists of 6-8 specialists: 2 Candid Photographers, 2 Cinematographers, 1 Licensed Drone Pilot, and 1 Audio/Lighting Assistant using Sony FX3 4K cinema cameras and G-Master prime lenses."
    },
    {
      q: "When do we receive the wedding teaser and full deliverables?",
      a: "We deliver the 60-second Instagram cinematic teaser within 48 hours of your wedding reception! The full 4K film and color-graded photo gallery are delivered in 4 weeks."
    }
  ]
};
