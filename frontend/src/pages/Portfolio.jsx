import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, Target, Trophy, Laptop } from 'lucide-react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Portfolio = () => {
  const fallbackPortfolio = [
    {
      _id: 'fallback-port-1',
      title: "Luigi's Fine Dining Website Launch",
      client: "Luigi Moretti",
      industry: "Restaurant",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      description: "Luigi's Bistro wanted a modern reservation-friendly website that retained their local Italian charm while feeling premium.",
      challenge: "Luigi's Bistro lacked booking tools, forcing clients to make tedious phone queries and leading to order drop-offs.",
      solution: "Implemented automated OpenTable booking frameworks, digitized their visual menu, and added local search optimization.",
      result: "Table reservations increased by 48% within the first 60 days of launch, with zero reservation booking downtime.",
      features: ["Digital Menu", "Interactive Photo Gallery", "Reservation System"],
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      completionDate: "June 2025"
    },
    {
      _id: 'fallback-port-2',
      title: "Modern Dental Clinic Patient Portal",
      client: "Dr. Evelyn Carter",
      industry: "Healthcare",
      thumbnail: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      description: "A complete medical site redesign enabling smooth patient booking and reducing administrative wait times.",
      challenge: "Clinic administrators spent over 4 hours a day manually sorting bookings and routing dental appointments.",
      solution: "Configured clean Calendly portals and medical FAQs to answer client checks autonomously.",
      result: "Reduced check-in queries by 35% through dynamic FAQs, optimizing receptionist task timelines.",
      features: ["Calendly Integration", "Patient FAQ Portal", "Interactive Google Maps"],
      technologies: ["React", "Vite", "Calendly API"],
      completionDate: "April 2025"
    },
    {
      _id: 'fallback-port-3',
      title: "SaaS Platform Waitlist Conversion Page",
      client: "Alex Rivera",
      industry: "SaaS Tech",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "A modern, dynamic landing page with clean pricing systems, magnetic newsletter waitlists, and rich visual animations.",
      challenge: "The startup had low traction on their pre-launch landing, converting only 2.1% of target visitors.",
      solution: "Redesigned conversion grids, refined pricing matrices, and implemented engaging loading animations.",
      result: "Acquired 10k+ early signs in under 3 weeks. Conversion click rates increased from 3% to 11%.",
      features: ["Animated Feature Cards", "Waitlist Wizard Flow", "Pricing Matrix"],
      technologies: ["Vite", "React", "Tailwind CSS"],
      completionDate: "July 2025"
    }
  ];

  const [portfolio, setPortfolio] = useState(fallbackPortfolio);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get('/portfolio');
        if (res.data?.portfolio && res.data.portfolio.length > 0) {
          setPortfolio(res.data.portfolio);
        }
      } catch (err) {
        console.error('Error fetching portfolio, loading mocks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-left space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Built For Businesses That Want To Stand Out
        </h1>
        <p className="text-slate-650 dark:text-slate-400 max-w-xl text-sm leading-relaxed">
          Explore case studies of local businesses, startups, and e-commerce stores we have helped scale into modern digital brands.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCase(item)}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:border-yellow-500/20 hover:shadow-xl transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="h-52 bg-slate-950 relative overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-300">
                    {item.industry}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                    {item.client}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between mt-auto">
                <div className="flex flex-wrap gap-1">
                  {(item.technologies || []).slice(0, 3).map((t) => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-yellow-500 font-semibold flex items-center gap-1">
                  Case Study
                  <Eye size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-white dark:bg-slate-950 border border-slate-250 dark:border-white/10 rounded-3xl overflow-y-auto max-h-[85vh] shadow-2xl glass-panel"
          >
            {/* Modal Header Banner */}
            <div className="h-56 relative overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-white/5">
              <img
                src={selectedCase.thumbnail}
                alt={selectedCase.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-left">
                <span className="text-xs uppercase font-bold text-yellow-500 tracking-widest">{selectedCase.client}</span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">{selectedCase.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 border border-slate-350 text-slate-700 hover:bg-slate-200 dark:bg-black/50 dark:border-white/10 dark:text-white flex items-center justify-center dark:hover:bg-black/75 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 text-left">
              {/* Stats Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={13} className="text-yellow-500" />
                    The Challenge
                  </h4>
                  <p className="text-xs text-slate-650 dark:text-slate-400 mt-2 leading-relaxed">{selectedCase.challenge}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-yellow-500" />
                    Our Solution
                  </h4>
                  <p className="text-xs text-slate-650 dark:text-slate-400 mt-2 leading-relaxed">{selectedCase.solution}</p>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop size={13} className="text-yellow-500" />
                  Technologies Utilized
                </h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(selectedCase.technologies || []).map((t) => (
                    <span key={t} className="text-[10px] px-3 py-1 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-white/5 text-slate-650 dark:text-slate-350 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Result Block */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-4">
                <Trophy size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-left space-y-1">
                  <h4 className="text-sm font-bold text-yellow-550 dark:text-yellow-500">Project Deliverables & Results</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{selectedCase.result}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
