import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 0 },
  currency: { type: String, default: '₹' },
  currencyCode: { type: String, default: 'INR' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  openingHours: { type: String, default: '11:00 AM – 11:00 PM Everyday' },
  domains: [{ type: String }], // custom domains e.g. royalspice.com
  status: { type: String, enum: ['active', 'suspended', 'provisioning'], default: 'active' },
  
  theme: {
    template: { type: String, default: 'luxury' },
    primary: { type: String, default: '#e63946' },
    secondary: { type: String, default: '#dfa645' },
    accent: { type: String, default: '#2a9d8f' },
    fontHeading: { type: String, default: 'Playfair Display' },
    fontBody: { type: String, default: 'Outfit' },
    borderRadius: { type: String, default: '18px' },
    heroLayout: { type: String, default: 'cinematic-split' }
  },

  sections: {
    hero: { enabled: { type: Boolean, default: true }, title: String, subtitle: String },
    specials: { enabled: { type: Boolean, default: true }, title: String, subtitle: String },
    story: { enabled: { type: Boolean, default: true }, title: String, text: String },
    offers: { enabled: { type: Boolean, default: true }, title: String },
    reviews: { enabled: { type: Boolean, default: true }, title: String },
    reservation: { enabled: { type: Boolean, default: true }, title: String }
  }
}, { timestamps: true });

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
