import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
  className = ""
}) {
  return (
    <div className={`space-y-3 ${center ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200/70 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider shadow-sm ${center ? 'mx-auto' : ''}`}>
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
