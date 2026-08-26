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
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50/80 border border-brand-200/70 text-brand-700 text-xs font-semibold uppercase tracking-wider shadow-sm ${center ? 'mx-auto' : ''}`}>
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
