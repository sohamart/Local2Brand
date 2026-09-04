const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure currentCountryTheme is declared inside GetStarted()
const targetDeclaration = `  // Language state
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;`;

const newDeclaration = `  // Language state
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Dynamic Country Cultural Theme based on selected country
  const currentCountryTheme = useMemo(() => {
    const selected = formData?.country || 'India';
    return COUNTRY_CULTURAL_THEMES[selected] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Global'];
  }, [formData?.country]);`;

// Check if currentCountryTheme is already declared or needs declaration
if (!content.includes('const currentCountryTheme = useMemo')) {
  content = content.replace(targetDeclaration, newDeclaration);
  console.log('Added currentCountryTheme useMemo');
}

// 2. Ensure appliedTemplate syncs formData.selectedCategory automatically
const syncEffectTarget = `  // Sync appliedTemplate whenever dynamic route / URL params / state change
  useEffect(() => {
    const direct = location.state?.selectedDemo || searchParams.get('title') || searchParams.get('template') || templateId || '';
    if (direct && direct !== 'Custom Website') {
      setAppliedTemplate(direct);
      setFormData(prev => ({
        ...prev,
        appliedTemplateName: direct
      }));
    }
  }, [templateId, searchParams, location.state]);`;

const syncEffectReplacement = `  // Sync appliedTemplate whenever dynamic route / URL params / state change
  useEffect(() => {
    const direct = location.state?.selectedDemo || searchParams.get('title') || searchParams.get('template') || templateId || '';
    if (direct && direct !== 'Custom Website') {
      setAppliedTemplate(direct);
      const matchedCategory = resolveCategoryFromTemplate(direct);
      setFormData(prev => ({
        ...prev,
        appliedTemplateName: direct,
        ...(matchedCategory ? { selectedCategory: matchedCategory } : {})
      }));
    }
  }, [templateId, searchParams, location.state]);

  // Guarantee that whenever appliedTemplate is set, selectedCategory is strictly locked to that template
  useEffect(() => {
    if (appliedTemplate && appliedTemplate !== 'Custom Website') {
      const matchedCategory = resolveCategoryFromTemplate(appliedTemplate);
      if (matchedCategory) {
        setFormData(prev => {
          if (prev.selectedCategory !== matchedCategory || prev.appliedTemplateName !== appliedTemplate) {
            return {
              ...prev,
              selectedCategory: matchedCategory,
              appliedTemplateName: appliedTemplate
            };
          }
          return prev;
        });
      }
    }
  }, [appliedTemplate]);`;

if (content.includes(syncEffectTarget)) {
  content = content.replace(syncEffectTarget, syncEffectReplacement);
  console.log('Replaced syncEffect with locked category synchronization');
}

// 3. Freeze body & html scrolling during AI Drawer
const scrollLockTarget = `  // Freeze background page scrolling when AI Drawer is open
  useEffect(() => {
    if (showAiDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAiDrawer]);`;

const scrollLockReplacement = `  // Freeze background page scrolling when AI Drawer is open
  useEffect(() => {
    if (showAiDrawer) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showAiDrawer]);`;

if (content.includes(scrollLockTarget)) {
  content = content.replace(scrollLockTarget, scrollLockReplacement);
  console.log('Updated scroll lock for body and html');
}

// 4. In Step 1, add the Dynamic Country Cultural Banner
const step1HeadingTarget = `            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t.labels?.clientHeading || 'Client & Business Information'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.labels?.clientSubheading || 'Enter your core contact and business details to initialize your project requirement.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

const step1HeadingReplacement = `            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {t.labels?.clientHeading || 'Client & Business Information'}
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-400/40 bg-purple-500/10 text-xs font-black text-purple-700 dark:text-purple-300 self-start sm:self-center">
                    <span>{currentCountryTheme.flag}</span>
                    <span>{formData.country || 'India'} Edition</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.labels?.clientSubheading || 'Enter your core contact and business details to initialize your project requirement.'}
                </p>
              </div>

              {/* Dynamic Country Cultural Greeting Banner */}
              <div className={\`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border \${currentCountryTheme.cardBorder} bg-gradient-to-r \${currentCountryTheme.bgGradient} shadow-md flex items-center justify-between gap-3 transition-all duration-500\`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl select-none filter drop-shadow">{currentCountryTheme.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {currentCountryTheme.culturalGreeting}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                      {currentCountryTheme.slogan}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-lg select-none opacity-80">
                  {currentCountryTheme.festiveMotif}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

if (content.includes(step1HeadingTarget)) {
  content = content.replace(step1HeadingTarget, step1HeadingReplacement);
  console.log('Added dynamic country cultural banner to Step 1');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated GetStarted.jsx successfully');
