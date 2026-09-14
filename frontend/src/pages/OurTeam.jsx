import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Code, ShieldCheck, Zap, Sparkles, Mail, ArrowRight, ExternalLink, Cpu, Layers, Terminal, Rocket, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { SEO } from '../components/common/CommonUI';
import { useOrderModal } from '../context/OrderModalContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import FinalCTA from '../components/home/FinalCTA';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

import FounderCard from '../components/common/FounderCard';

export default function OurTeam() {
  const { openOrderModal } = useOrderModal();
  const { settings } = useSiteSettings();

  const defaultFounders = [
    {
      name: 'Soham Dutta',
      role: 'Lead Architect & Full-Stack Systems',
      subtitle: 'Core Architecture & AI Systems',
      avatarColor: 'from-purple-600 via-indigo-600 to-violet-700',
      bio: 'Leading high-performance digital systems, reactive web engines, full-stack microservices, and AI-driven automation pipelines. Obsessed with sub-second page performance.',
      skills: ['React / Vite', 'Node.js & MongoDB', 'Cloud Architecture', 'System Design'],
      email: 'contact@weblets.bond',
      instagram: 'https://instagram.com/sohamart',
      linkedin: 'https://linkedin.com/in/soham-dutta',
      github: 'https://github.com/sohamart',
      badge: 'Architecture'
    },
    {
      name: 'Sayantan',
      role: 'Technical Lead & Frontend Engineering',
      subtitle: 'UI/UX Polish & Web Performance',
      avatarColor: 'from-blue-600 via-cyan-600 to-teal-600',
      bio: 'Engineering liquid-smooth interactive interfaces, responsive fluid typography, and glassmorphism styling that elevates businesses into global brands.',
      skills: ['Frontend Architecture', 'Fluid Animation', 'Tailwind & Modern CSS', 'PWA & Edge CDN'],
      email: 'contact@weblets.bond',
      instagram: '',
      linkedin: '',
      github: '',
      badge: 'Frontend & UI'
    },
    {
      name: 'Achinta',
      role: 'Operations & Product Delivery Lead',
      subtitle: 'Client Success & Execution',
      avatarColor: 'from-amber-600 via-orange-600 to-rose-600',
      bio: 'Orchestrating seamless client onboarding, rapid 48-hour delivery pipelines, requirement verification, and ensuring zero-friction project turnarounds.',
      skills: ['Agile Delivery', 'Client Strategy', 'Quality Engineering', 'Growth Operations'],
      email: 'contact@weblets.bond',
      instagram: '',
      linkedin: '',
      github: '',
      badge: 'Operations & QA'
    }
  ];

  const teamList = settings.aiSettings?.adminShowableDetails?.founders && settings.aiSettings.adminShowableDetails.founders.length > 0
    ? settings.aiSettings.adminShowableDetails.founders
    : defaultFounders;

  return (
    <>
      <SEO
        title="Our Team — Meet the Engineers & Visionaries | Weblets"
        description="Meet the core founders and architects at Weblets: Soham Dutta, Sayantan, and Achinta. Crafting world-class web experiences for ambitious brands."
      />

      <div className="page-header-offset pb-24">
        {/* Header Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>The Minds Behind Weblets</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Meet Our <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">Engineering & Design</span> Team
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We are a tight-knit squad of software architects, modern designers, and product specialists dedicated to making high-impact websites that captivate and convert.
          </p>
        </div>

        {/* Core Team Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamList.map((member, idx) => (
              <FounderCard key={idx} founder={member} index={idx} />
            ))}
          </div>
        </div>

        {/* Engineering Philosophy Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Our Promise</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  We don't just deliver websites. We build your digital unfair advantage.
                </h3>
                <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
                  Every line of code is written for blistering speed, top-tier SEO discoverability, and delightful customer journeys. When you work with Weblets, you talk directly with the engineers crafting your project.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                <Link
                  to="/get-started"
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all"
                >
                  Start Project Blueprint
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-center text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                >
                  Talk with Founders
                </Link>
              </div>
            </div>
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
