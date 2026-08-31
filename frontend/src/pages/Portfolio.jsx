import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { portfolioProjects, projectCategories } from '../data/projects';
import { useOrderModal } from '../context/OrderModalContext';
import FinalCTA from '../components/home/FinalCTA';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { openOrderModal } = useOrderModal();

  const filteredProjects = activeCategory === 'All'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <>
      <SEO
        title="Portfolio & Case Studies — Proven Digital Transformations"
        description="Explore our portfolio of high-converting websites, digital rebrands, and bespoke web platforms engineered for ambitious businesses."
      />

      <div className="pt-36 sm:pt-44 lg:pt-48 pb-20">

        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <AshokaChakra size={13} />
            <span>🇮🇳 Indian & Global Success Stories</span>
          </div>
          <SectionHeading
            badge="Selected Works"
            title="Work That Speaks for Your Brand."
            subtitle="Explore our gallery of delivered projects, case studies, and digital transformations that turned local businesses into industry leaders."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 sm:mt-10 flex items-center justify-start sm:justify-center overflow-x-auto pb-3 no-scrollbar gap-1.5 sm:gap-2">
            {projectCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md'
                      : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-panel rounded-card sm:rounded-hero p-5 sm:p-8 border border-white dark:border-slate-700/80 shadow-glass hover:shadow-glass-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Visual Preview */}
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-950 mb-6 group border border-white dark:border-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700">
                      {project.category}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {project.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    {project.tagline}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 border-y border-slate-100 dark:border-slate-800 mb-6 text-center sm:text-left">
                    {project.metrics.map((m, i) => (
                      <div key={i}>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">{m.value}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100/80 dark:border-slate-800">
                  <button
                    onClick={() => openOrderModal({
                      websiteType: `Custom Project like ${project.title}`,
                      selectedDemo: project.title
                    })}
                    className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:shadow-md transition-all cursor-pointer hover:opacity-95"
                  >
                    Build Website Like This
                  </button>

                  {project.liveDemoSlug && (
                    <Link
                      to={`/demos/${project.liveDemoSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      <span>Inspect Template</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-amber-400/40 via-blue-400/30 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-20">
          <FinalCTA />
        </div>

      </div>
    </>
  );
}
