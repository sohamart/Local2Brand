import React, { useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false, size = 'md' }) {
  const { toggleTheme, isDark } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    setIsAnimating(true);
    toggleTheme(e);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer overflow-hidden group select-none ${
        size === 'sm' ? 'p-1.5' : 'p-2 sm:px-3 sm:py-2'
      } ${
        isDark
          ? 'bg-slate-900/90 text-amber-400 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 shadow-sm hover:shadow-md shadow-amber-500/10'
          : 'bg-white/90 text-slate-800 hover:text-slate-950 border border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-md shadow-purple-500/10'
      } ${isAnimating ? 'scale-95 ring-2 ring-purple-500/40' : 'hover:scale-105 active:scale-95'} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Dynamic Background Hover Glow */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/15 via-amber-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-center gap-1.5 pointer-events-none">
        <div className="relative w-4 h-4 flex items-center justify-center transition-transform duration-500 ease-out">
          {isDark ? (
            <Sun className={`w-4 h-4 transition-all duration-500 text-amber-400 ${isAnimating ? 'rotate-180 scale-125' : 'rotate-0 scale-100'}`} />
          ) : (
            <Moon className={`w-4 h-4 transition-all duration-500 text-purple-600 ${isAnimating ? '-rotate-90 scale-125' : 'rotate-0 scale-100'}`} />
          )}
        </div>

        {showLabel && (
          <span className="text-xs font-bold font-sans">
            {isDark ? 'Light' : 'Dark'}
          </span>
        )}
      </div>
    </button>
  );
}
