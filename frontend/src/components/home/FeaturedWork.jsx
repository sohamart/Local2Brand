import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { portfolioProjects } from '../../data/projects';
import { useOrderModal } from '../../context/OrderModalContext';

export default function FeaturedWork() {
  const { openOrderModal } = useOrderModal();
  const displayedProjects = portfolioProjects.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-blue top-1/4 -left-20 w-[600px] h-[400px]" />
      <div className="section-glow section-glow-purple bottom-1/4 -right-20 w-[550px] h-[350px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Client Case Studies"
          title="Work That Speaks for Your Brand."
          subtitle="A glimpse into recent custom websites and high-performing digital transformations delivered for ambitious clients."
        />

        {/* Projects Grid */}
        <div className="mt-16 space-y-12">
          {displayedProjects.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={project.id}
                className="glass-panel rounded-hero p-5 sm:p-8 lg:p-10 border border-white shadow-glass transition-all duration-300 hover:shadow-glass-lg"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''
                  }`}>

                  {/* Visual Preview */}
                  <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-card overflow-hidden shadow-md group aspect-[16/10] bg-slate-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md">
                          Live Architecture Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className={`lg:col-span-5 space-y-5 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {project.year}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-sm font-semibold text-brand-600 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      {project.tagline}
                    </p>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200/70">
                      {project.metrics.map((metric, i) => (
                        <div key={i}>
                          <div className="text-base sm:text-lg font-black text-slate-900">
                            {metric.value}
                          </div>
                          <div className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openOrderModal({
                          websiteType: `Custom Project like ${project.title}`,
                          selectedDemo: project.title
                        })}
                        className="px-5 py-2.5 rounded-btn text-xs font-bold text-white l2b-gradient-bg shadow-sm hover:shadow-md transition-all cursor-pointer hover:opacity-95"
                      >
                        Build Website Like This
                      </button>

                      {project.liveDemoSlug && (
                        <Link
                          to={`/demos/${project.liveDemoSlug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                        >
                          <span>View Demo Details</span>
                          <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                        </Link>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* View All Portfolio Link */}
        <div className="mt-14 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-btn text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-glass transition-all hover:scale-[1.02]"
          >
            <span>View All Client Case Studies</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}
