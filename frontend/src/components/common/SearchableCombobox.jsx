import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';

export default function SearchableCombobox({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Select...',
  searchPlaceholder = 'Type to search...',
  required = false,
  error = null,
  disabled = false,
  allowCustom = true,
  icon: Icon = null,
  emptyMessage = 'No matching options found.'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter(opt =>
    typeof opt === 'string' && opt.toLowerCase().includes((searchTerm || '').toLowerCase().trim())
  );

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {value && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px]">
              ✓ {value}
            </span>
          )}
        </label>
      )}

      {/* Trigger Box */}
      <div
        onClick={() => {
          if (!disabled) {
            const nextState = !isOpen;
            setIsOpen(nextState);
            if (nextState) {
              setTimeout(() => inputRef.current?.focus(), 60);
            }
          }
        }}
        className={`w-full px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer select-none transition-all ${
          disabled
            ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800'
            : isOpen
            ? 'bg-white dark:bg-slate-900 border-purple-500 ring-4 ring-purple-500/15 shadow-sm text-slate-900 dark:text-white'
            : 'bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700/60 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {Icon && <Icon className="w-4 h-4 text-purple-500 shrink-0" />}
          <span className={`text-xs font-semibold truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
            {value || placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearchTerm('');
              }}
              className="p-1 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-500' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu with Live Search Filter */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
          {/* Search Input Bar */}
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List of Options */}
          <div className="overflow-y-auto max-h-48 space-y-0.5 no-scrollbar pr-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    value === opt
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {value === opt && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              ))
            ) : (
              <div className="p-2.5 text-center text-xs text-slate-400 dark:text-slate-500">
                {emptyMessage}
              </div>
            )}

            {/* Custom Option if searched query doesn't match predefined list */}
            {allowCustom && searchTerm.trim() && !safeOptions.some(o => o.toLowerCase() === searchTerm.toLowerCase().trim()) && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all flex items-center gap-1.5 cursor-pointer mt-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Use custom: "{searchTerm.trim()}"</span>
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
