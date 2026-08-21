import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Demo from '../models/Demo.js';
import Portfolio from '../models/Portfolio.js';
import Testimonial from '../models/Testimonial.js';
import Project from '../models/Project.js';
import Invoice from '../models/Invoice.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import ContactLead from '../models/ContactLead.js';

dotenv.config();

const demos = [
  {
    name: 'Restaurant Pro',
    category: 'Restaurant',
    description: 'A premium, visual-heavy website design for fine dining restaurants and bistros. Features booking integrations, dynamic menus, and beautiful dish carousels.',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://restaurant-pro.demo.local2brand.com',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'OpenTable API'],
    features: ['Online Table Booking', 'Digital Interactive Menu', 'Chef Showcase', 'Instagram Live Feed Integration'],
    startingPrice: 15000,
    published: true,
  },
  {
    name: 'Startup Landing',
    category: 'Agency',
    description: 'High-conversion SaaS landing page with Stripe-like color flows, pricing tables, client testimonial sliders, and smooth scroll animations.',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://startup-landing.demo.local2brand.com',
    technologies: ['Vite', 'React', 'Tailwind CSS v4', 'Framer Motion'],
    features: ['Clean Feature Grid', 'Interactive Pricing Toggles', 'Waitlist Sign-up Forms', 'Animated FAQ Accordion'],
    startingPrice: 20000,
    published: true,
  },
  {
    name: 'Medical Clinic',
    category: 'Healthcare',
    description: 'A professional and clean website template tailored for doctors, dentists, and clinics. Features patient portals and online appointment scheduling.',
    previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://medical-clinic.demo.local2brand.com',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Calendly Integration'],
    features: ['Doctor Profiles', 'Secure Booking Form', 'FAQ Section', 'Google Maps Location Finder'],
    startingPrice: 18000,
    published: true,
  },
  {
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'A complete online storefront template with rich product displays, cart overlays, discount modules, and quick-checkout support.',
    previewImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://ecommerce.demo.local2brand.com',
    technologies: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Razorpay SDK'],
    features: ['Product Filters', 'Shopping Cart Overlay', 'Review & Rating Systems', 'Payment Gateway Integration'],
    startingPrice: 35000,
    published: true,
  },
  {
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'A visually striking, dark-mode portfolio for photographers, designers, and creative directors. Loaded with magnetic UI CTAs and smooth slider reveals.',
    previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://creative-portfolio.demo.local2brand.com',
    technologies: ['React', 'GSAP', 'Framer Motion', 'Tailwind CSS'],
    features: ['Infinite Masonry Grid', '3D Card Tilt Effects', 'Interactive Project Detail Pages', 'Dark/Light Toggle'],
    startingPrice: 12000,
    published: true,
  },
  {
    name: 'Modern Coaching',
    category: 'Education',
    description: 'An educational platform website designed for coaching institutes, tutors, and online educators. Integrates with video hosts and learning hubs.',
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://coaching.demo.local2brand.com',
    technologies: ['React', 'Tailwind CSS', 'YouTube API Integration'],
    features: ['Course Catalog', 'Live Webinar Scheduler', 'Student Testimonials', 'Resource PDF Download Center'],
    startingPrice: 16000,
    published: true,
  },
  {
    name: 'Real Estate Pro',
    category: 'Real Estate',
    description: 'A search-focused dashboard site design for local real estate brokers and property managers. Filter listings by price, location, and rooms.',
    previewImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    liveUrl: 'https://realestate.demo.local2brand.com',
    technologies: ['React', 'Tailwind CSS', 'Leaflet Map APIs'],
    features: ['Advanced Search Bar', 'Dynamic Interactive Map', 'Virtual Tour Video Embedding', 'Agent Contact Portal'],
    startingPrice: 25000,
    published: true,
  },
  {
    name: 'Agency Pro',
    category: 'Agency',
    description: 'The ultimate b2b service website with custom quote estimators, case study cards, and live service progress walkthroughs.',
    previewImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    liveUrl: '/demos/preview/agency-pro',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS v4'],
    features: ['Interactive Price Estimator', 'Client Logo Trust Wall', 'Team Member Accordion', 'Lead Form Wizards'],
    startingPrice: 22000,
    published: true,
  },
  {
    name: 'Personal Brand',
    category: 'Personal Brand',
    description: 'Sleek, typography-focused site for writers, public speakers, and executives. Integrates with Substack, Medium, and LinkedIn newsletters.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    liveUrl: '/demos/preview/personal-brand',
    technologies: ['Vite', 'React', 'Tailwind CSS v4'],
    features: ['Substack Newsletter Embed', 'Speaking Gig Timeline', 'Clean PDF Resume Download', 'Social Trust Strip'],
    startingPrice: 10000,
    published: true,
  },
  {
    name: 'Local Business',
    category: 'Business',
    description: 'A local service website optimized for plumbers, electricians, and cleaning agencies. Engineered for SEO and mobile speed to capture direct local bookings.',
    previewImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    liveUrl: '/demos/preview/local-business',
    technologies: ['React', 'Tailwind CSS', 'Google Business Reviews API'],
    features: ['Click-to-Call CTAs', 'Reviews Showcase', 'Local SEO Schema Markup', 'Service Area Mapping'],
    startingPrice: 12000,
    published: true,
  },
];

const portfolios = [
  {
    title: 'The Italian Bistro Redesign',
    client: 'Luigi\'s Fine Dining',
    industry: 'Restaurant',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Created a stunning modern online presence that drove reservation booking conversion upwards by 42%.',
    challenge: 'Luigi\'s had an outdated, non-responsive site with hard-to-read PDF menus, leading to high drop-offs on mobile and low reservation bookings.',
    solution: 'Designed a fully custom, mobile-first React site with instant reservation booking triggers and high-definition photography of signature dishes.',
    features: ['Mobile-optimized menu', 'Direct Opentable Integration', 'Local SEO Boost'],
    technologies: ['React', 'Tailwind CSS', 'OpenTable API'],
    result: '42% increase in reservations within the first 30 days and 65% mobile speed optimization.',
    published: true,
  },
  {
    title: 'E-commerce Platform Scaling',
    client: 'Urban Thread Co.',
    industry: 'E-commerce',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    gallery: [],
    description: 'Engineered a highly aesthetic and ultra-fast fashion storefront for Urban Thread Co.',
    challenge: 'Slow Shopify loading times on mobile devices were leading to cart abandonments.',
    solution: 'Built a headless checkout system on top of a custom, lightweight Vite React frontend.',
    features: ['One-click Cart Drawer', 'Razorpay Secure Payment Checkout', 'Personalized Product Recommendations'],
    technologies: ['React', 'Node.js', 'Redux', 'Razorpay'],
    result: 'Checkout abandonment rate dropped by 24%, average page load time reduced to 0.8s.',
    published: true,
  },
  {
    title: 'SaaS Startup Launch Landing Page',
    client: 'PayPulse Analytics',
    industry: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    gallery: [],
    description: 'Built a sleek Stripe-like product showcase landing page that captured over 5,000 waitlist registrations.',
    challenge: 'PayPulse needed to explain a complex payment orchestration tool simply to capture beta signups.',
    solution: 'Crafted a premium landing page with step-by-step Interactive widgets and glassmorphic dashboards.',
    features: ['Interactive Graph Simulator', 'Framer Motion scroll timeline', 'Secure Waitlist Form'],
    technologies: ['React', 'Framer Motion', 'Tailwind CSS v4'],
    result: '5,000+ waitlist registrations in 2 weeks and featured on ProductHunt.',
    published: true,
  },
];

const testimonials = [
  {
    rating: 5,
    testimonial: 'Local2Brand literally turned our local bistro into a global-feeling brand. Our booking numbers doubled in months!',
    clientName: 'Luigi Moretti',
    business: 'Luigi\'s Fine Dining',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    published: true,
  },
  {
    rating: 5,
    testimonial: 'The dashboard feature was amazing. I knew exactly what stages my website design was at. Zero headache, perfect clarity.',
    clientName: 'Sarah Jenkins',
    business: 'Urban Thread Co.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    published: true,
  },
  {
    rating: 5,
    testimonial: 'Sleek design, modern animations, and excellent support. My portfolio website looks incredibly professional.',
    clientName: 'Amit Sharma',
    business: 'Freelance UI Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    published: true,
  },
];

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database Connected.');

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Demo.deleteMany();
    await Portfolio.deleteMany();
    await Testimonial.deleteMany();
    await Project.deleteMany();
    await Invoice.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    await ContactLead.deleteMany();

    console.log('Seeding Users...');
    // Seed Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      phone: '+8801700000000',
      password: 'password123',
      role: 'SUPER_ADMIN',
    });

    // Seed Normal User / Client
    const clientUser = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+8801811111111',
      password: 'password123',
      role: 'USER',
    });

    console.log('Seeding Demos...');
    const createdDemos = await Demo.insertMany(demos);

    console.log('Seeding Portfolio...');
    await Portfolio.insertMany(portfolios);

    console.log('Seeding Testimonials...');
    await Testimonial.insertMany(testimonials);

    console.log('Seeding Projects...');
    // Seed an active project for John Doe
    const project = await Project.create({
      name: 'Luigi\'s Dine-In Site',
      category: 'Restaurant',
      status: 'Development',
      progress: 72,
      currentStage: 'Development',
      budget: 15000,
      client: clientUser._id,
      assignedTeam: [superAdmin._id],
      description: 'Create an premium food ordering and digital table reservation website.',
      demoSelected: createdDemos[0]._id, // Restaurant Pro
      stages: [
        { stageName: 'Project Confirmed', status: 'Completed', adminNote: 'Requirements aligned and initial terms signed.' },
        { stageName: 'Requirements', status: 'Completed', adminNote: 'Collected brand assets, menu items, and dish photos.' },
        { stageName: 'UI Design', status: 'Completed', adminNote: 'Figma mockups approved by the client.' },
        { stageName: 'Design Approval', status: 'Completed', adminNote: 'Client signed off on UI layouts.' },
        { stageName: 'Development', status: 'In Progress', adminNote: 'Vite React + Tailwind layout setup is ongoing. Adding menu tabs.' },
        { stageName: 'Testing', status: 'Pending' },
        { stageName: 'Client Review', status: 'Pending' },
        { stageName: 'Deployment', status: 'Pending' },
        { stageName: 'Launch', status: 'Pending' },
      ],
    });

    console.log('Seeding Project Messages...');
    await Message.create([
      {
        sender: superAdmin._id,
        project: project._id,
        text: 'Hello John! We have successfully completed the UI Design mockups and are starting on the Vite development server today. Let us know if you need any adjustments.',
      },
      {
        sender: clientUser._id,
        project: project._id,
        text: 'Everything looks amazing! I approved the design. Can we make sure the menu loads quickly on 3G?',
      },
      {
        sender: superAdmin._id,
        project: project._id,
        text: 'Absolutely, we are optimizing all image assets using WebP format to ensure rapid page load times.',
      },
    ]);

    console.log('Seeding Invoices...');
    await Invoice.create({
      invoiceNumber: 'L2B-2026-001',
      project: project._id,
      client: clientUser._id,
      amount: 15000,
      status: 'Partially Paid',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      downloadUrl: '#',
    });

    console.log('Seeding Notifications...');
    await Notification.create([
      {
        recipient: clientUser._id,
        title: 'Development Started',
        description: 'Development stage has started for Luigi\'s Dine-In Site.',
        relatedProject: project._id,
        type: 'PROJECT_UPDATE',
      },
      {
        recipient: clientUser._id,
        title: 'Invoice Issued',
        description: 'New invoice L2B-2026-001 has been issued.',
        relatedProject: project._id,
        type: 'INVOICE',
      },
    ]);

    console.log('Seeding Contact Leads...');
    await ContactLead.create([
      {
        name: 'Jane Smith',
        email: 'jane@coaching.com',
        phone: '+8801999999999',
        businessName: 'Apex Classes',
        message: 'Looking for a clean coaching landing page to accept online student registrations. I like your Modern Coaching demo.',
        status: 'New',
      },
    ]);

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
