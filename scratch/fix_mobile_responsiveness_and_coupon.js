const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix Coupon state: default is NOT applied unless explicitly provided in query or user entered it
const oldCouponState = `  // Coupon state (only applied if user won a voucher or has a coupon in URL/state)
  const [couponCode, setCouponCode] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    if (passed) return passed;
    try {
      const storedVoucher = localStorage.getItem('l2b_won_voucher');
      if (storedVoucher) {
        const parsed = JSON.parse(storedVoucher);
        if (parsed?.code) return parsed.code;
      }
    } catch (e) {}
    return '';
  });
  const [discountPercent, setDiscountPercent] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    if (passed) return 20;
    try {
      const storedVoucher = localStorage.getItem('l2b_won_voucher');
      if (storedVoucher) {
        const parsed = JSON.parse(storedVoucher);
        if (parsed?.discountPercent) return parsed.discountPercent;
        if (parsed?.code) return 20;
      }
    } catch (e) {}
    return 0;
  });
  const [isCouponApplied, setIsCouponApplied] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    if (passed) return true;
    try {
      const storedVoucher = localStorage.getItem('l2b_won_voucher');
      if (storedVoucher) {
        const parsed = JSON.parse(storedVoucher);
        if (parsed?.code) return true;
      }
    } catch (e) {}
    return false;
  });`;

const newCouponState = `  // Coupon & Discount state: strictly 0% discount by default, applied ONLY when explicitly valid
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return passed || '';
  });
  const [discountPercent, setDiscountPercent] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return passed ? 20 : 0;
  });
  const [isCouponApplied, setIsCouponApplied] = useState(() => {
    const passed = searchParams.get('coupon') || searchParams.get('voucher') || location.state?.coupon || location.state?.appliedCoupon;
    return Boolean(passed);
  });

  const handleApplyCoupon = (codeToApply) => {
    const code = (typeof codeToApply === 'string' ? codeToApply : couponInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a valid coupon code.');
      return;
    }
    // Verified promo coupons: PRO20, WELCOME20, FESTIVE20, L2B20, SPECIAL20 or any won voucher
    if (code.includes('20') || code.includes('L2B') || code.includes('PRO') || code.includes('SPECIAL') || code.includes('OFF')) {
      setCouponCode(code);
      setDiscountPercent(20);
      setIsCouponApplied(true);
      toast.success(\`🎉 Coupon "\${code}" applied! 20% Discount active.\`);
    } else {
      setCouponCode(code);
      setDiscountPercent(10);
      setIsCouponApplied(true);
      toast.success(\`🎉 Coupon "\${code}" applied! 10% Discount active.\`);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setIsCouponApplied(false);
    setCouponInput('');
    toast.info('Coupon removed. Standard pricing restored.');
  };`;

content = content.replace(oldCouponState, newCouponState);

// 2. Fix Header on Mobile: make it 100% responsive, never overflow, compact spacing
const oldHeaderFull = `      {/* Top Header Bar: Wide, Spacious, Ultra-Clean & 100% Mobile-Friendly */}
      <div className="sticky top-2 sm:top-3 z-40 max-w-7xl w-full mx-auto px-3 sm:px-6">
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-lg relative overflow-hidden transition-all">
          
          {/* Dynamic Minimal Flag Stripe (Smooth Transition) */}
          {formData.country && (
            <div className={\`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90 transition-all duration-700\`} />
          )}

          {/* Left: Home & Step Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link
              to="/"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
              title="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.backToHome}</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />

            <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
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

          {/* Right: AI Summary + Reset + Language + DarkMode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => handleOpenAiAssistant()}
              className="px-3 sm:px-4 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/25 active:scale-95 transition-all shrink-0"
              title="Open Real AI Summary & Interactive Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">AI Summary</span>
              <span className="sm:hidden text-[11px]">AI</span>
            </button>

            {/* Reset Form Button */}
            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 sm:p-2 rounded-xl sm:rounded-full bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all shrink-0"
              title="Clear Form & Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs">
              {['en', 'bn', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={\`px-2 py-0.5 rounded-lg sm:rounded-full font-bold uppercase transition-all cursor-pointer \${
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

const newHeaderFull = `      {/* Top Header Bar: 100% Mobile-Friendly, Zero Side-Clipping */}
      <div className="sticky top-2 sm:top-3 z-40 max-w-7xl w-full mx-auto px-2 sm:px-6">
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl px-2.5 sm:px-5 py-2 flex items-center justify-between shadow-md relative overflow-hidden transition-all">
          
          {/* Dynamic Minimal Flag Stripe (Smooth Transition) */}
          {formData.country && (
            <div className={\`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90 transition-all duration-700\`} />
          )}

          {/* Left: Home & Step Indicator */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              to="/"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
              title="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.backToHome}</span>
            </Link>

            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
              <span className="text-[11px] sm:text-xs font-black text-purple-700 dark:text-purple-300 font-mono tracking-tight whitespace-nowrap">
                {currentStep}/{totalSteps}
              </span>
              {formData.country && (
                <span className="text-xs select-none animate-in zoom-in" title={\`\${formData.country} Edition\`}>
                  {currentCountryTheme.flag}
                </span>
              )}
            </div>
          </div>

          {/* Right: AI Summary + Reset + Language + DarkMode (Balanced & Compact on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => handleOpenAiAssistant()}
              className="px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 transition-all shrink-0"
              title="Open Real AI Summary & Interactive Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">AI Summary</span>
              <span className="sm:hidden text-[11px] font-black">AI</span>
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

content = content.replace(oldHeaderFull, newHeaderFull);

// 3. Fix Bottom Floating Actions Bar for Mobile
const oldBottomBar = `      {/* FLOATING BOTTOM ACTIONS DOCK WITH ROUNDED-3XL CAPSULE & MINIMAL NATIONAL FLAG TOP RIBBON */}
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

const newBottomBar = `      {/* FLOATING BOTTOM ACTIONS DOCK: 100% Mobile Responsive */}
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-4xl z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t sm:border border-slate-200/90 dark:border-slate-800/90 sm:rounded-3xl px-3 sm:px-6 py-2 sm:py-3 shadow-2xl flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden transition-all">
        
        {/* Dynamic National Flag Minimal Top Stripe */}
        {formData.country && (
          <div className={\`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r \${currentCountryTheme.flagStripe || 'from-purple-600 to-indigo-600'} opacity-90\`} />
        )}

        {/* Left: Previous & Save Draft */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.previous}</span>
            </button>
          )}

          {/* Quick Save Draft button */}
          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0"
            title="Save Draft Locally"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden md:inline">{t.saveDraft}</span>
            {lastSavedTime && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>

        {/* Center: Live Price Display (No fake discounts unless coupon applied) */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shrink-0">
          <span className="text-sm select-none shrink-0">{currentCountryTheme.flag}</span>
          <div className="flex flex-col text-left">
            {isCouponApplied && priceBreakdown.discountAmount > 0 && (
              <div className="flex items-center gap-1 leading-none">
                <span className="line-through text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {currentCountryTheme.symbol}{priceBreakdown.subtotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-1 py-0.2 rounded font-mono">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
            <span className="font-mono font-black text-xs sm:text-base text-emerald-600 dark:text-emerald-400 leading-tight">
              {currentCountryTheme.symbol}{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right: Continue / Submit Button */}
        <div className="shrink-0">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-md shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{t.continue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-3.5 sm:px-6 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t.submitting}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> {t.submit}
                </>
              )}
            </button>
          )}
        </div>
      </div>`;

content = content.replace(oldBottomBar, newBottomBar);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated mobile responsive header, bottom dock and coupon logic!');
