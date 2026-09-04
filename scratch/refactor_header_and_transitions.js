const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update initial formData.country to 'India' as default or handle blank transition
// Make sure currentCountryTheme gracefully handles default
const themeMemoTarget = `  // Dynamic Country Cultural Theme based on selected country
  const currentCountryTheme = useMemo(() => {
    const selected = formData?.country || 'India';
    return COUNTRY_CULTURAL_THEMES[selected] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Global'];
  }, [formData?.country]);`;

const themeMemoReplacement = `  // Dynamic Country Cultural Theme based on selected country (Transitions smoothly)
  const currentCountryTheme = useMemo(() => {
    const selected = formData?.country || 'India';
    return COUNTRY_CULTURAL_THEMES[selected] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Other'];
  }, [formData?.country]);`;

if (content.includes(themeMemoTarget)) {
  content = content.replace(themeMemoTarget, themeMemoReplacement);
}

// 2. Update Header: remove country select dropdown from header and make it 100% ultra-compact & mobile responsive
const oldHeaderRegex = /\{\/\* Top Header Bar with Rounded Corners & Minimal National Flag Bottom Ribbon \*\/\}[\s\S]*?<\/header>\s*<\/div>/;

const newHeaderCode = `{/* Top Header Bar: Ultra-Clean, Non-Overflowing, 100% Mobile-Friendly */}
      <div className="sticky top-2 z-40 max-w-5xl mx-auto w-full px-2 sm:px-4">
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl px-2.5 sm:px-5 py-2 flex items-center justify-between shadow-lg relative overflow-hidden transition-all">
          
          {/* Dynamic Minimal Flag Stripe (Smooth Transition) */}
          {formData.country && (
            <div className={\`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90 transition-all duration-700\`} />
          )}

          {/* Left: Home & Step Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
              title="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.backToHome}</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:border-slate-800 hidden xs:block" />

            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
              <span className="text-[11px] sm:text-xs font-black text-purple-700 dark:text-purple-300 font-mono tracking-tight whitespace-nowrap">
                Step {currentStep}/{totalSteps}
              </span>
              {formData.country && (
                <span className="text-xs ml-0.5 select-none animate-in zoom-in" title={\`\${formData.country} Edition\`}>
                  {currentCountryTheme.flag}
                </span>
              )}
            </div>
          </div>

          {/* Right: AI Summary + Reset + Language + DarkMode (Compact, No Overflow on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => handleOpenAiAssistant()}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-purple-500/25 active:scale-95 transition-all shrink-0"
              title="Open Real AI Summary & Interactive Advisor"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">AI Summary</span>
              <span className="sm:hidden text-[11px]">AI</span>
            </button>

            {/* Reset Form Button */}
            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 rounded-xl sm:rounded-full bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all shrink-0"
              title="Clear Form & Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs">
              {['en', 'bn', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={\`px-1.5 py-0.5 rounded-lg sm:rounded-full font-bold uppercase transition-all cursor-pointer \${
                    lang === l
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }\`}
                >
                  {l}
                </button>
              ))}
            </div>

            <ThemeToggle />
          </div>
        </header>
      </div>`;

content = content.replace(oldHeaderRegex, newHeaderCode);
console.log('Replaced header with ultra-clean, mobile responsive layout without country select');

// 3. In handleAddressUpdate: Add country transition animation & toast feedback
const addressTarget = `  // Auto-compose formatted full address whenever subfields change
  const handleAddressUpdate = (updates) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      const effectiveDistrict = next.district === 'Other' ? (next.otherDistrict || '') : next.district;
      const parts = [
        next.streetAddress?.trim(),
        effectiveDistrict?.trim(),
        next.state?.trim(),
        next.pincode?.trim() ? \`PIN: \${next.pincode.trim()}\` : '',
        next.country?.trim()
      ].filter(Boolean);

      next.businessAddress = parts.join(', ');
      next.cityLocation = [effectiveDistrict?.trim(), next.state?.trim()].filter(Boolean).join(', ');
      return next;
    });
  };`;

const addressReplacement = `  // Auto-compose formatted full address with smooth country theme morph
  const handleAddressUpdate = (updates) => {
    if (updates.country && updates.country !== formData.country) {
      toast.info(\`✨ Switched to \${updates.country} Edition cultural theme\`, { autoClose: 2000 });
    }
    setFormData(prev => {
      const next = { ...prev, ...updates };
      const effectiveDistrict = next.district === 'Other' ? (next.otherDistrict || '') : next.district;
      const parts = [
        next.streetAddress?.trim(),
        effectiveDistrict?.trim(),
        next.state?.trim(),
        next.pincode?.trim() ? \`PIN: \${next.pincode.trim()}\` : '',
        next.country?.trim()
      ].filter(Boolean);

      next.businessAddress = parts.join(', ');
      next.cityLocation = [effectiveDistrict?.trim(), next.state?.trim()].filter(Boolean).join(', ');
      return next;
    });
  };`;

if (content.includes(addressTarget)) {
  content = content.replace(addressTarget, addressReplacement);
  console.log('Added smooth country transition toast in handleAddressUpdate');
}

// 4. In Step 1 Country Dropdown, give it a prominent animated selection style
const countryDropdownTarget = `                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        {t.labels?.country || 'Country'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={e => handleAddressUpdate({ country: e.target.value, state: '', district: '' })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-purple-500 text-slate-900 dark:text-white text-xs outline-none"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>
                        ))}
                      </select>
                      {stepErrors.country && <p className="text-xs text-red-500 mt-1">{stepErrors.country}</p>}
                    </div>`;

const countryDropdownReplacement = `                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>{t.labels?.country || 'Country'} <span className="text-red-500">*</span></span>
                        {formData.country && (
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {currentCountryTheme.flag} {formData.country} Theme Active
                          </span>
                        )}
                      </label>
                      <select
                        value={formData.country || 'India'}
                        onChange={e => handleAddressUpdate({ country: e.target.value, state: '', district: '' })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700/60 focus:border-purple-500 text-slate-900 dark:text-white text-xs font-semibold outline-none shadow-xs transition-all cursor-pointer"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {COUNTRY_CULTURAL_THEMES[c]?.flag || '🌐'} {c}
                          </option>
                        ))}
                      </select>
                      {stepErrors.country && <p className="text-xs text-red-500 mt-1">{stepErrors.country}</p>}
                    </div>`;

if (content.includes(countryDropdownTarget)) {
  content = content.replace(countryDropdownTarget, countryDropdownReplacement);
  console.log('Updated Step 1 country select dropdown with active theme badge');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('GetStarted.jsx updated successfully!');
