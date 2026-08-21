import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Smartphone, Eye, CheckCircle, ChevronDown, Sparkles, Layers } from 'lucide-react';
import API from '../services/api';

const Home = () => {
  // Pre-configured mock showcase fallback data
  const fallbackDemos = [
    {
      _id: 'fallback-1',
      name: 'Restaurant Pro',
      category: 'Dining & Cafe',
      description: 'A visual-heavy website design for modern bistros. Features booking systems, dynamic menus, and beautiful dish showcases.',
      previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos',
      startingPrice: 15000,
      technologies: ['React', 'Framer Motion', 'Tailwind']
    },
    {
      _id: 'fallback-2',
      name: 'Startup Launchpad',
      category: 'SaaS & Agency',
      description: 'High-conversion landing page with smooth layout structures, pricing panels, and premium micro-interactions.',
      previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos',
      startingPrice: 20000,
      technologies: ['Vite', 'React', 'Tailwind CSS']
    },
    {
      _id: 'fallback-3',
      name: 'Medical Portal',
      category: 'Health & Clinic',
      description: 'A clean clinic website configuration. Features instant doctor schedules and patient informational portals.',
      previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      liveUrl: '/demos',
      startingPrice: 18000,
      technologies: ['React', 'Vite', 'Calendly API']
    }
  ];

  const [demos, setDemos] = useState(fallbackDemos);
  const [loading, setLoading] = useState(true);
  const [activeMockIndex, setActiveMockIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  // Rotating Hero slides
  const heroMockDemos = [
    { name: 'Restaurant Pro', category: 'Fine Dining Bistro', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Startup Launchpad', category: 'SaaS Platform', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Medical Portal', category: 'Clinic Portal', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMockIndex((prev) => (prev + 1) % heroMockDemos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/demos');
        if (res.data?.demos && res.data.demos.length > 0) {
          setDemos(res.data.demos.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home data, loading mocks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const faqs = [
    { q: 'How long does a website take to build?', a: 'Standard templates take between 7 to 10 working days. Custom configurations require 3 to 6 weeks depending on requirements.' },
    { q: 'Can I request design revisions?', a: 'Yes! We host requirement checkpoint syncs and revise design files directly based on your brand feedback.' },
    { q: 'How does live milestone tracking work?', a: 'Log in to your client dashboard to view progress checkmarks. From layout design to backend setup and DNS configurations, track everything live.' },
    { q: 'Do you manage domain linking and hosting?', a: 'Yes. We deploy to global Vercel/AWS servers and configure your custom domains directly.' }
  ];

  return (
    <div className="space-y-24 pb-24 overflow-x-hidden">
      {/* 1. HERO VIEW */}
      <section className="relative pt-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles size={12} />
            Premium Website Marketplace & Agency
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Turn Your Local Business <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent glow-text">
              Into a Digital Brand.
            </span>
          </h1>

          <p className="text-slate-650 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Choose a visual design catalog template or launch a custom Figma workspace design. We deploy fully responsive, lightning-fast portals with direct client milestone checklists.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/demos"
              className="px-7 py-4 text-sm font-bold flex items-center gap-2 liquid-btn"
            >
              Explore Website Catalog
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/start-project"
              className="px-7 py-4 rounded-full bg-white/80 border border-slate-300 dark:bg-slate-900 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-yellow-500/40 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            >
              Start Custom Design Flow
            </Link>
          </div>
        </div>

        {/* Right Column - Premium Screen Frame */}
        <div className="lg:col-span-5 relative flex justify-center p-4">
          <div className="radial-mesh -top-12 -right-12"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[480px] bg-white/60 dark:bg-slate-950/40 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 dark:border-white/5 overflow-hidden shadow-2xl relative"
          >
            {/* Window bar */}
            <div className="h-10 px-4 bg-slate-100/65 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-white/5 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <div className="flex-1 mx-4 h-6 rounded-full bg-slate-200/50 dark:bg-slate-950/40 flex items-center justify-center text-[10px] text-slate-500 font-mono tracking-tight select-none">
                localhost:5173/demos/{heroMockDemos[activeMockIndex].name.toLowerCase().replace(' ', '-')}
              </div>
            </div>

            {/* Simulated Live View */}
            <div className="h-[250px] sm:h-[285px] relative bg-slate-950 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockIndex}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={heroMockDemos[activeMockIndex].image}
                    alt={heroMockDemos[activeMockIndex].name}
                    className="w-full h-full object-cover scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-left">
                    <span className="text-[9px] uppercase font-bold text-yellow-400 tracking-wider">
                      {heroMockDemos[activeMockIndex].category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {heroMockDemos[activeMockIndex].name}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Frosted Waterdrop Overlay Widgets */}
          <div className="absolute -top-2 -left-2 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/50 dark:border-white/10 flex items-center gap-2.5 shadow-lg select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shrink-0"></div>
            <div className="text-left">
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Milestone Build</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">72% Completed</p>
            </div>
          </div>

          <div className="absolute -bottom-2 right-6 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/50 dark:border-white/10 flex items-center gap-2.5 shadow-lg select-none">
            <CheckCircle size={14} className="text-yellow-500 shrink-0" />
            <div className="text-left">
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Deployment Status</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Figma Approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS TRUST STRIP */}
      <section className="bg-slate-100/50 dark:bg-slate-950/40 py-8 border-y border-slate-200/50 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-around gap-6 text-slate-600 dark:text-slate-400 text-xs font-extrabold tracking-wider uppercase select-none">
          <span className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-yellow-500" />
            Premium Custom Designs
          </span>
          <span className="flex items-center gap-2.5">
            <Zap size={16} className="text-yellow-500" />
            Milestone Invoicing
          </span>
          <span className="flex items-center gap-2.5">
            <Smartphone size={16} className="text-yellow-500" />
            Fully Responsive Layouts
          </span>
          <span className="flex items-center gap-2.5">
            <Eye size={16} className="text-yellow-500" />
            Live Checklist Portals
          </span>
        </div>
      </section>

      {/* 3. SHOWCASE PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-14 relative">
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High-Converting Website Marketplace
          </h2>
          <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
            Choose a premade website setup below. We will customize every element, layout, and link to fit your brand identity seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo) => (
            <motion.div
              key={demo._id}
              whileHover={{ y: -6 }}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-lg flex flex-col group hover:border-yellow-500/25 hover:shadow-xl transition-all"
            >
              <div className="h-48 relative overflow-hidden bg-slate-950">
                <img
                  src={demo.previewImage}
                  alt={demo.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm border border-white/10 text-[9px] font-semibold text-slate-200">
                  {demo.category}
                </span>
                <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-sm border border-yellow-500/20 text-[10px] font-semibold text-yellow-500">
                  Starts at ₹{demo.startingPrice.toLocaleString()}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between gap-5 text-left">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {demo.name}
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {demo.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60 dark:border-white/5">
                  {demo.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2">
          <Link
            to="/demos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-500 hover:text-yellow-600 transition-colors group"
          >
            Browse Complete Website Catalog
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. CLIENT DASHBOARD PORTAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
        {/* Left Column - Portal mockup card */}
        <div className="lg:col-span-6 relative flex justify-center p-4">
          <div className="radial-mesh -bottom-12 -left-12"></div>
          
          <div className="w-full max-w-[450px] bg-white/60 dark:bg-slate-950/40 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative select-none">
            {/* Simulated bar */}
            <div className="h-10 px-5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Client Dashboard</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold">
                STAGE CHECKPOINT
              </span>
            </div>

            {/* Stages checklist body */}
            <div className="p-6 space-y-6 text-left">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Website Build</h4>
                  <span className="text-xs font-extrabold text-yellow-500">72%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="w-[72%] h-full bg-yellow-400"></div>
                </div>
              </div>

              <div className="space-y-3.5 pl-1">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-yellow-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-500 dark:text-slate-450 line-through">UI Design Approval</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-yellow-500 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                  </div>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">Development Stage (Ongoing)</span>
                </div>
                <div className="flex items-start gap-2.5 opacity-35">
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-500 mt-0.5 shrink-0"></div>
                  <span className="text-xs text-slate-650 dark:text-slate-400">Client Sign-Off & Launch</span>
                </div>
              </div>

              {/* Chat bubble overlay */}
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                <p className="text-[9px] text-yellow-500 font-semibold uppercase">Admin Message</p>
                <p className="text-xs text-slate-750 dark:text-slate-300 mt-0.5 leading-relaxed">
                  "API endpoints are set up. Beginning frontend integration checklist today."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Description */}
        <div className="lg:col-span-6 space-y-6 text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 text-xs font-semibold uppercase tracking-wider">
            <Layers size={12} />
            Full Project Visibility
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Track Your Website Build <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent glow-text">
              Every Step of the Way.
            </span>
          </h2>
          
          <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
            Log in to your dashboard to view milestones, upload media assets, communicate edits directly with the admin panel, and launch live with direct checkpoints.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle size={15} className="text-yellow-500" />
              Real-time milestone progress checklists
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle size={15} className="text-yellow-500" />
              Direct project messenger workspace
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle size={15} className="text-yellow-500" />
              Secure file vault for layouts and domain mapping keys
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section className="max-w-3xl mx-auto px-6 text-center space-y-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Frequently Answered Inquiries
        </h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/65 dark:border-white/5 rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4.5 flex items-center justify-between text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-bold text-xs md:text-sm cursor-pointer select-none"
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className={`text-slate-650 dark:text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-xs text-slate-650 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-white/5 pt-3.5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION ACTION SHEET */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-r from-yellow-950/15 via-amber-950/15 to-slate-950/65 rounded-[32px] border border-slate-200 dark:border-white/10 p-10 md:p-14 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="radial-mesh -top-20 -left-20"></div>
          
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Ready to Launch Your Digital Brand?
            </h2>
            <p className="text-slate-650 dark:text-slate-350 text-xs md:text-sm leading-relaxed">
              Explore design layouts configured for local businesses and organizations, or consult our layout workspace today.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              to="/start-project"
              className="px-7 py-3.5 text-xs font-bold text-black flex items-center gap-2 liquid-btn"
            >
              Start Setup Flow
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-full bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Consult an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
