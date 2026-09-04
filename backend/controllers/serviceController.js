import { Service } from '../models/Service.js';
import { sendServiceDeletionAlert } from '../utils/email.js';

// Seed default services
const DEFAULT_SERVICES = [
  {
    title: 'Fast-Track Website Showcase',
    slug: 'fast-track-websites',
    icon: 'Rocket',
    shortDesc: 'Launch a pixel-perfect, mobile-responsive custom website in as little as 48 hours.',
    fullDesc: 'We take our battle-tested demo architectures and fully re-skin and customize them with your exact branding, copywriting, images, and offerings.',
    startingPrice: '₹9,999 / $399',
    features: ['48h Turnaround', 'Mobile & Desktop Fluid', 'SEO Optimized', 'SSL Included'],
    isPopular: true,
    order: 1,
  },
  {
    title: 'Custom Brand & UI/UX Design',
    slug: 'custom-branding-design',
    icon: 'Palette',
    shortDesc: 'Bespoke design systems, interactive 3D elements, and modern high-converting layouts.',
    fullDesc: 'Tailored specifically for ambitious brands needing unique aesthetics, custom workflows, and high-impact visual storytelling.',
    startingPrice: '₹24,999 / $799',
    features: ['Custom Figma Architecture', '3D & Motion UI', 'Interactive Prototyping', 'Design System'],
    isPopular: false,
    order: 2,
  },
  {
    title: 'E-Commerce & Digital Storefronts',
    slug: 'ecommerce-storefronts',
    icon: 'ShoppingCart',
    shortDesc: 'High-speed online shopping experiences with payment gateways and automated order tracking.',
    fullDesc: 'Complete online store build with cart, wishlist, multi-tier checkout, inventory management, and UPI/Stripe integration.',
    startingPrice: '₹34,999 / $999',
    features: ['Razorpay / Stripe Gateway', 'Product Management', 'Coupon & Discount Engine', 'Order Tracking'],
    isPopular: false,
    order: 3,
  },
  {
    title: 'Local SEO & Speed Performance',
    slug: 'local-seo-speed',
    icon: 'Zap',
    shortDesc: 'Achieve 95+ Google PageSpeed scores, structured schema, and top local search ranking.',
    fullDesc: 'Optimize web core vitals, indexation, Google Business profiles, and local search presence to attract nearby customers.',
    startingPrice: '₹14,999 / $499',
    features: ['95+ Core Web Vitals', 'Local Schema Markup', 'Google Maps Sync', 'Speed Acceleration'],
    isPopular: false,
    order: 4,
  },
];

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ order: 1 });

    if (!services || services.length === 0) {
      services = await Service.insertMany(DEFAULT_SERVICES);
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      services: DEFAULT_SERVICES,
    });
  }
};

// @desc    Create service (Admin)
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    return res.status(200).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (service) {
      sendServiceDeletionAlert(service).catch((err) => console.warn('Service deletion alert error:', err.message));
    }
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
