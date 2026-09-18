import React from 'react';
import { Mail, ExternalLink, Code2 } from 'lucide-react';

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

export default function FounderCard({ founder, index = 0 }) {
  const bgGradients = [
    'from-purple-600 via-indigo-600 to-violet-700',
    'from-blue-600 via-cyan-600 to-teal-600',
    'from-amber-600 via-orange-600 to-rose-600'
  ];

  const gradient = founder.avatarColor || bgGradients[index % bgGradients.length];
  const photoUrl = founder.image || founder.avatar || founder.photoUrl || '';
  const initials = founder.name
    ? founder.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'W';

  const badgeText = founder.badge || (founder.role ? founder.role.split('&')[0].trim() : 'Core Leader');

  return (
    <div className="group relative rounded-3xl p-7 sm:p-8 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 shadow-lg shadow-slate-200/60 dark:shadow-none hover:shadow-2xl hover:shadow-purple-500/15 flex flex-col justify-between overflow-hidden">
      {/* Subtle dynamic glow circle */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} opacity-15 dark:opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity`} />

      <div>
        {/* Top Header: Avatar + Badge */}
        <div className="flex items-center justify-between mb-6">
          {photoUrl ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-purple-500/30 group-hover:ring-purple-500/70 group-hover:shadow-purple-500/20 transition-all shrink-0 bg-slate-100 dark:bg-slate-800 relative">
              <img
                src={photoUrl}
                alt={founder.name || 'Founder Photo'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-black text-2xl shadow-inner">${initials}</div>`;
                }}
              />
            </div>
          ) : (
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl ring-2 ring-white/20 dark:ring-white/10 group-hover:ring-purple-500/50 group-hover:scale-105 transition-all shrink-0`}>
              {initials}
            </div>
          )}

          <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 shadow-2xs">
            {badgeText}
          </span>
        </div>

        {/* Name & Role */}
        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
          {founder.name || 'Founding Partner'}
        </h3>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
          {founder.role || 'Founding Engineer'}
        </p>
        {founder.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {founder.subtitle}
          </p>
        )}

        {/* Bio */}
        {founder.bio && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
            {founder.bio}
          </p>
        )}

        {/* Skills Chips */}
        {(() => {
          const skillsList = Array.isArray(founder.skills)
            ? founder.skills
            : (typeof founder.skills === 'string'
                ? founder.skills.split(',').map((s) => s.trim()).filter(Boolean)
                : []);
          if (!skillsList || skillsList.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {skillsList.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 group-hover:border-purple-500/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Social / Direct Connect Bar */}
      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {founder.instagram && (
            <a
              href={founder.instagram.startsWith('http') ? founder.instagram : `https://instagram.com/${founder.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 dark:text-pink-400 border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer"
              title="Instagram Profile"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
          {founder.linkedin && (
            <a
              href={founder.linkedin.startsWith('http') ? founder.linkedin : `https://linkedin.com/in/${founder.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {founder.github && (
            <a
              href={founder.github.startsWith('http') ? founder.github : `https://github.com/${founder.github.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {founder.email && (
            <a
              href={`mailto:${founder.email}`}
              className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center gap-1">
          <span>Weblets Team</span>
        </span>
      </div>
    </div>
  );
}
