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
  hours: "Mon - Sat: 10:00 AM - 8:00 PM (Prior Appointment)",
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",

  packages: [
    {
      id: 1,
      name: "The Royal 3-Day Destination Wedding",
      price: 280000,
      days: "3 Days Full Coverage",
      deliverables: ["4K Cinematic Wedding Film (12-15 Mins)", "1-Minute Instagram Teaser in 48 Hours", "600+ Color Graded Hi-Res Photos", "Drone Aerial Cinematography", "2 Premium Velvet Flushmount Albums"],
      popular: true
    },
    {
      id: 2,
      name: "Pre-Wedding Cinematic Storybook",
      price: 65000,
      days: "1-2 Days Outdoor Shoot",
      deliverables: ["Concept Pre-Wedding Story Film (3 Mins)", "60 Fine-Art Retouched Portraits", "Drone Footage & 3 Outfit Changes", "Hair & Makeup Stylist Included"],
      popular: false
    },
    {
      id: 3,
      name: "Classic 2-Day Wedding Essentials",
      price: 160000,
      days: "2 Days Coverage",
      deliverables: ["Traditional & Candid Photography", "Full HD Wedding Highlight Reel", "350+ Retouched Photos", "1 Coffee Table Photobook"],
      popular: false
    }
  ]
};
