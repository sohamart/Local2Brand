import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
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
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-400 cursor-pointer overflow-hidden group ${
        isDark
          ? 'bg-slate-900/90 text-amber-400 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 shadow-sm hover:shadow-md shadow-amber-500/10'
          : 'bg-white/90 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
      } ${isAnimating ? 'scale-90 ring-2 ring-purple-500/40' : 'hover:scale-105 active:scale-95'} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Subtle background button ripple */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none transition-transform duration-500 ease-out">
        {isDark ? (
          <Sun className={`w-4 h-4 transition-all duration-500 text-amber-400 ${isAnimating ? 'rotate-180 scale-125' : 'rotate-0 scale-100'}`} />
        ) : (
          <Moon className={`w-4 h-4 transition-all duration-500 text-purple-600 ${isAnimating ? '-rotate-90 scale-125' : 'rotate-0 scale-100'}`} />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-bold pointer-events-none">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
