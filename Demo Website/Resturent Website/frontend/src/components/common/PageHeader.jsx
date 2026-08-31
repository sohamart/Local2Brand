import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

export const PageHeader = ({ title, subtitle, badge, breadcrumbs = [] }) => {
  return (
    <div className="relative py-12 sm:py-16 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#10131e] via-[#090b11] to-[#07080c]">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gold-glow opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-amber-400 transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-amber-300 font-semibold">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* Golden Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest shadow-gold-glow"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{badge}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

      </div>
    </div>
  );
};
