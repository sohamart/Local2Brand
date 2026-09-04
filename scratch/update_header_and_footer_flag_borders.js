const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Top Header Bar with rounded corners and minimal bottom flag stripe
const oldHeader = `      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 uppercase tracking-wider font-mono">
            Step {currentStep}/{totalSteps}
          </span>

          {/* Dynamic Country Cultural Selector Dropdown */}
          <div className="relative ml-1">
            <select
              value={formData.country || 'India'}
              onChange={(e) => handleAddressUpdate({ country: e.target.value })}
              className={\`text-xs font-black px-2.5 py-1 rounded-xl border \${currentCountryTheme.cardBorder} \${currentCountryTheme.headerBadge} cursor-pointer outline-none transition-all shadow-xs\`}
              title="Select Business Country & Cultural Theme"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold">
                  {COUNTRY_CULTURAL_THEMES[c]?.flag || '🌐'} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Requirement Guide & Chat Trigger (Vibrant & Unmissable) */}
          <button
            type="button"
            onClick={() => handleOpenAiAssistant()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-95 transition-all shrink-0 animate-pulse"
            title="Open Real AI Summary & Interactive Architect"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">✨ AI Smart Summary &amp; Chat</span>
            <span className="sm:hidden">🤖 AI Summary</span>
          </button>

          {/* Reset Option */}
          <button
            type="button"
            onClick={handleResetForm}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 cursor-pointer transition-all"
            title="Clear Form & Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {['en', 'bn', 'hi'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={\`px-1.5 sm:px-2 py-0.5 rounded-lg font-bold uppercase transition-all cursor-pointer \${
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
      </header>`;

const newHeader = `      {/* Top Header Bar with Rounded Corners & Minimal National Flag Bottom Ribbon */}
      <div className="sticky top-2 z-40 max-w-5xl mx-auto w-[96%] sm:w-full px-2 sm:px-0">
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-lg relative overflow-hidden transition-all">
          
          {/* Dynamic National Flag Minimal Bottom Stripe */}
          <div className={\`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-orange-500 via-white to-emerald-500'} opacity-90\`} />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.backToHome}</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="text-[11px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 uppercase tracking-wider font-mono">
              Step {currentStep}/{totalSteps}
            </span>

            {/* Dynamic Country Cultural Selector Dropdown with Rounded Pill */}
            <div className="relative ml-0.5 sm:ml-1">
              <select
                value={formData.country || 'India'}
                onChange={(e) => handleAddressUpdate({ country: e.target.value })}
                className={\`text-xs font-black px-2 sm:px-2.5 py-1 rounded-full border \${currentCountryTheme.cardBorder} \${currentCountryTheme.headerBadge} cursor-pointer outline-none transition-all shadow-2xs\`}
                title="Select Business Country & Cultural Theme"
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold">
                    {COUNTRY_CULTURAL_THEMES[c]?.flag || '🌐'} {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Requirement Guide & Chat Trigger */}
            <button
              type="button"
              onClick={() => handleOpenAiAssistant()}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/25 active:scale-95 transition-all shrink-0"
              title="Open Real AI Summary & Interactive Architect"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">✨ AI Summary &amp; Chat</span>
              <span className="sm:hidden">AI Chat</span>
            </button>

            {/* Reset Option */}
            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
              title="Clear Form & Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
              {['en', 'bn', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={\`px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer \${
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

if (content.includes(oldHeader)) {
  content = content.replace(oldHeader, newHeader);
  console.log('Updated Top Header with rounded corners and minimal flag stripe');
}

// 2. Update Sticky Bottom Actions Dock with rounded-3xl floating capsule and minimal top flag stripe
const oldFooter = `      {/* STICKY BOTTOM ACTIONS & SAVE DOCK (ALWAYS VISIBLE & MOBILE FRIENDLY) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-3 sm:px-8 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2 transition-all">
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.previous}</span>
            </button>
          )}

          {/* Quick Save Draft button in Bottom Dock */}
          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
            title="Save Draft Locally"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">{t.saveDraft}</span>
            {lastSavedTime && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        {/* Middle live price summary pill (Ultra-responsive on BOTH Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/60 dark:via-slate-900 dark:to-indigo-950/60 px-2.5 sm:px-4 py-1.5 rounded-2xl border border-purple-200/80 dark:border-purple-800/80 shadow-xs">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider hidden xs:inline">Est:</span>
              {isCouponApplied && priceBreakdown.discountAmount > 0 && (
                <span className="line-through text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {currentCountryTheme.symbol}{priceBreakdown.subtotal.toLocaleString('en-IN')}
                </span>
              )}
              {isCouponApplied && (
                <span className="text-[9px] sm:text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-200/90 dark:bg-purple-900/90 px-1.5 py-0.5 rounded-md border border-purple-300 dark:border-purple-700">
                  20% OFF
                </span>
              )}
            </div>
            <span className="font-mono font-black text-sm sm:text-lg text-emerald-600 dark:text-emerald-400 leading-tight">
              {currentCountryTheme.symbol}{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right Continue / Submit Button */}
        <div>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <span>{t.continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {t.submitting}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> {t.submit}
                </>
              )}
            </button>
          )}
        </div>
      </div>`;

const newFooter = `      {/* FLOATING BOTTOM ACTIONS DOCK WITH ROUNDED-3XL CAPSULE & MINIMAL NATIONAL FLAG TOP RIBBON */}
      <div className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-4xl z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between gap-2 overflow-hidden transition-all">
        
        {/* Dynamic National Flag Minimal Top Stripe */}
        <div className={\`absolute top-0 left-6 right-6 h-[2.5px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-orange-500 via-white to-emerald-500'} opacity-90\`} />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 sm:px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.previous}</span>
            </button>
          )}

          {/* Quick Save Draft button in Bottom Dock */}
          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-2.5 sm:px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
            title="Save Draft Locally"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">{t.saveDraft}</span>
            {lastSavedTime && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        {/* Middle live price summary pill */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 sm:px-4 py-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
          <span className="text-base select-none shrink-0">{currentCountryTheme.flag}</span>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider hidden xs:inline">Est:</span>
              {isCouponApplied && priceBreakdown.discountAmount > 0 && (
                <span className="line-through text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {currentCountryTheme.symbol}{priceBreakdown.subtotal.toLocaleString('en-IN')}
                </span>
              )}
              {isCouponApplied && (
                <span className="text-[9px] sm:text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.2 rounded-md border border-purple-300 dark:border-purple-700">
                  20% OFF
                </span>
              )}
            </div>
            <span className="font-mono font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400 leading-tight">
              {currentCountryTheme.symbol}{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right Continue / Submit Button */}
        <div>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-md shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <span>{t.continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {t.submitting}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> {t.submit}
                </>
              )}
            </button>
          )}
        </div>
      </div>`;

if (content.includes(oldFooter)) {
  content = content.replace(oldFooter, newFooter);
  console.log('Updated Sticky Bottom Dock with rounded corners and top flag stripe');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating header and footer with flag stripes and rounded corners');
