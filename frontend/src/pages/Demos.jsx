import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Star, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Demos = () => {
  const fallbackDemos = [
    {
      _id: 'fallback-1',
      name: 'Restaurant Pro',
      category: 'Restaurant',
      description: 'A premium, visual-heavy website design for fine dining restaurants and bistros. Features booking integrations, dynamic menus, and beautiful dish carousels.',
      previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos/preview/restaurant-pro',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'OpenTable API'],
      features: ['Online Table Booking', 'Digital Interactive Menu', 'Chef Showcase', 'Instagram Live Feed Integration'],
      startingPrice: 15000,
      published: true,
    },
    {
      _id: 'fallback-2',
      name: 'Startup Landing',
      category: 'Agency',
      description: 'High-conversion SaaS landing page with Stripe-like color flows, pricing tables, client testimonial sliders, and smooth scroll animations.',
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos/preview/startup-landing',
      technologies: ['Vite', 'React', 'Tailwind CSS v4', 'Framer Motion'],
      features: ['Clean Feature Grid', 'Interactive Pricing Toggles', 'Waitlist Sign-up Forms', 'Animated FAQ Accordion'],
      startingPrice: 20000,
      published: true,
    },
    {
      _id: 'fallback-3',
      name: 'Medical Clinic',
      category: 'Healthcare',
      description: 'A professional and clean website template tailored for doctors, dentists, and clinics. Features patient portals and online appointment scheduling.',
      previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos/preview/medical-clinic',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Calendly Integration'],
      features: ['Doctor Profiles', 'Secure Booking Form', 'FAQ Section', 'Google Maps Location Finder'],
      startingPrice: 18000,
      published: true,
    },
    {
      _id: 'fallback-4',
      name: 'E-commerce Store',
      category: 'E-commerce',
      description: 'A complete online storefront template with rich product displays, cart overlays, discount modules, and quick-checkout support.',
      previewImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos/preview/ecommerce-store',
      technologies: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Razorpay SDK'],
      features: ['Product Filters', 'Shopping Cart Overlay', 'Review & Rating Systems', 'Payment Gateway Integration'],
      startingPrice: 35000,
      published: true,
    },
    {
      _id: 'fallback-5',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      description: 'A visually striking, dark-mode portfolio for photographers, designers, and creative directors. Loaded with magnetic UI CTAs and smooth slider reveals.',
      previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['React', 'GSAP', 'Framer Motion', 'Tailwind CSS'],
      features: ['Infinite Masonry Grid', '3D Card Tilt Effects', 'Interactive Project Detail Pages', 'Dark/Light Toggle'],
      startingPrice: 12000,
      published: true,
    },
    {
      _id: 'fallback-6',
      name: 'Modern Coaching',
      category: 'Education',
      description: 'An educational platform website designed for coaching institutes, tutors, and online educators. Integrates with video hosts and learning hubs.',
      previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['React', 'Tailwind CSS', 'YouTube API Integration'],
      features: ['Course Catalog', 'Live Webinar Scheduler', 'Student Testimonials', 'Resource PDF Download Center'],
      startingPrice: 16000,
      published: true,
    },
    {
      _id: 'fallback-7',
      name: 'Real Estate Pro',
      category: 'Real Estate',
      description: 'A search-focused dashboard site design for local real estate brokers and property managers. Filter listings by price, location, and rooms.',
      previewImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['React', 'Tailwind CSS', 'Leaflet Map APIs'],
      features: ['Advanced Search Bar', 'Dynamic Interactive Map', 'Virtual Tour Video Embedding', 'Agent Contact Portal'],
      startingPrice: 25000,
      published: true,
    },
    {
      _id: 'fallback-8',
      name: 'Agency Pro',
      category: 'Agency',
      description: 'The ultimate b2b service website with custom quote estimators, case study cards, and live service progress walkthroughs.',
      previewImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS v4'],
      features: ['Interactive Price Estimator', 'Client Logo Trust Wall', 'Team Member Accordion', 'Lead Form Wizards'],
      startingPrice: 22000,
      published: true,
    },
    {
      _id: 'fallback-9',
      name: 'Personal Brand',
      category: 'Personal Brand',
      description: 'Sleek, typography-focused site for writers, public speakers, and executives. Integrates with Substack, Medium, and LinkedIn newsletters.',
      previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['Vite', 'React', 'Tailwind CSS v4'],
      features: ['Substack Newsletter Embed', 'Speaking Gig Timeline', 'Clean PDF Resume Download', 'Social Trust Strip'],
      startingPrice: 10000,
      published: true,
    },
    {
      _id: 'fallback-10',
      name: 'Local Business',
      category: 'Business',
      description: 'A local service website optimized for plumbers, electricians, and cleaning agencies. Engineered for SEO and mobile speed to capture direct local bookings.',
      previewImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      liveUrl: '#',
      technologies: ['React', 'Tailwind CSS', 'Google Business Reviews API'],
      features: ['Click-to-Call CTAs', 'Reviews Showcase', 'Local SEO Schema Markup', 'Service Area Mapping'],
      startingPrice: 12000,
      published: true,
    },
  ];

  const [demos, setDemos] = useState(fallbackDemos);
  const [filteredDemos, setFilteredDemos] = useState(fallbackDemos);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All', ...new Set(fallbackDemos.map(d => d.category))]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const res = await API.get('/demos');
        if (res.data?.demos && res.data.demos.length > 0) {
          setDemos(res.data.demos);
          setFilteredDemos(res.data.demos);

          // Get unique categories
          const cats = ['All', ...new Set(res.data.demos.map(d => d.category))];
          setCategories(cats);
        }
      } catch (err) {
        console.error('Error fetching demos, using mock templates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDemos();
  }, []);

  // Filter demos on category change
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredDemos(demos);
    } else {
      setFilteredDemos(demos.filter(d => d.category === selectedCategory));
    }
  }, [selectedCategory, demos]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-left space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Website Showcase Marketplace
        </h1>
        <p className="text-slate-650 dark:text-slate-400 max-w-xl text-sm leading-relaxed">
          Choose a design built specifically for your sector. We handle color branding, hosting integration, and content changes so you get a launch-ready site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter - Desktop */}
        <aside className="hidden lg:flex flex-col gap-5 border border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/20 p-5 rounded-2xl h-fit">
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
            <Filter size={16} className="text-yellow-500 dark:text-yellow-450" />
            <h3 className="font-bold text-sm uppercase text-slate-800 dark:text-slate-200">Categories</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Horizontal Filters */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 scrollbar-none select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Demos Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner />
          ) : filteredDemos.length === 0 ? (
            <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-900/25 border border-dashed border-slate-250 dark:border-white/5 rounded-2xl space-y-3">
              <p className="text-slate-600 dark:text-slate-400 text-sm">No templates match this category yet.</p>
              <Link to="/start-project" className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold hover:underline">
                Request a Custom Website Design instead →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDemos.map((demo) => (
                <motion.div
                  key={demo._id}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-yellow-500/30 hover:shadow-xl transition-all"
                >
                  {/* Card Image */}
                  <div className="h-48 relative overflow-hidden bg-slate-950">
                    <img
                      src={demo.previewImage}
                      alt={demo.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-200">
                      {demo.category}
                    </span>
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-yellow-950/80 backdrop-blur-sm border border-yellow-500/20 text-[10px] font-semibold text-yellow-500">
                      Starting at ₹{demo.startingPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Card details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {demo.name}
                      </h3>
                      <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {demo.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Features</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {demo.features.slice(0, 4).map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                            <CheckCircle size={10} className="text-yellow-500 dark:text-yellow-450 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-white/5 pt-4">
                      {demo.technologies.map((t) => (
                        <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* CTA triggers */}
                    <div className="flex gap-3 border-t border-slate-200 dark:border-white/5 pt-4">
                      <a
                        href={demo.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/60 dark:bg-slate-800 dark:border-white/10 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-750 flex items-center justify-center gap-1.5"
                      >
                        Live Demo
                        <ExternalLink size={12} />
                      </a>
                      <Link
                        to={`/start-project?demo=${demo._id}`}
                        className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center gap-1"
                      >
                        Select Design
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demos;
