const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure CulturalMascotArt import
if (!content.includes('import CulturalMascotArt from')) {
  content = content.replace(
    `import { STEP_AI_GUIDES } from '../data/stepAiData';`,
    `import { STEP_AI_GUIDES } from '../data/stepAiData';\nimport CulturalMascotArt from '../components/common/CulturalMascotArt';`
  );
  console.log('Added CulturalMascotArt import');
}

// 2. Replace the harsh ambient glow background with a clean, pro-designer backdrop
const oldBgTarget = `      {/* Dynamic Country Cultural Ambient Mesh & Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-700">
        <div className={\`absolute inset-0 bg-gradient-to-br \${currentCountryTheme.bgGradient} opacity-50 transition-all duration-700\`} />
        <div
          className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full blur-3xl animate-pulse transition-all duration-700"
          style={{ background: currentCountryTheme.accentGlow }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] rounded-full blur-3xl animate-pulse delay-1000 transition-all duration-700"
          style={{ background: currentCountryTheme.accentGlow }}
        />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
      </div>`;

const newBgReplacement = `      {/* Subtle Pro-Designer Ambient Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-20 transition-opacity duration-700">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>`;

if (content.includes(oldBgTarget)) {
  content = content.replace(oldBgTarget, newBgReplacement);
  console.log('Replaced harsh glow with subtle pro backdrop');
}

// 3. Mount CulturalMascotArt directly below Step Progress Tracker
const stepProgressTarget = `          {/* Step Pill Indicators with Lock Icons and NO SCROLLBAR */}
          <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-semibold select-none">`;

const stepProgressWithMascot = `          {/* Step Pill Indicators with Lock Icons and NO SCROLLBAR */}
          <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-semibold select-none">`;

// In main container, place CulturalMascotArt right after the Step Progress Tracker box
const trackerEndTarget = `              {/* If Next Steps Locked */}
              {Array.from({ length: totalSteps - currentStep }).map((_, lidx) => {
                const stepNum = currentStep + lidx + 1;
                return (
                  <span
                    key={stepNum}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 shrink-0 select-none opacity-60 text-[10px]"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span>{stepNum}.</span>
                    <span className="truncate max-w-[70px] sm:max-w-[90px]">{t.steps[stepNum - 1]?.title.split(' ')[0]}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>`;

const trackerEndWithMascot = `              {/* If Next Steps Locked */}
              {Array.from({ length: totalSteps - currentStep }).map((_, lidx) => {
                const stepNum = currentStep + lidx + 1;
                return (
                  <span
                    key={stepNum}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 shrink-0 select-none opacity-60 text-[10px]"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span>{stepNum}.</span>
                    <span className="truncate max-w-[70px] sm:max-w-[90px]">{t.steps[stepNum - 1]?.title.split(' ')[0]}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Dynamic Cultural Mascot & Heritage Mini-Art */}
          <div className="mb-5">
            <CulturalMascotArt country={formData.country || 'India'} lang={lang} />
          </div>
        </div>`;

if (content.includes(trackerEndTarget)) {
  content = content.replace(trackerEndTarget, trackerEndWithMascot);
  console.log('Added CulturalMascotArt component below progress tracker');
}

// 4. Refine category cards in Step 2 to be ultra-clean and eliminate heavy glows
const oldCatCardClass = `                      className={\`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between \${
                        isSelected
                          ? 'bg-purple-50 dark:bg-gradient-to-br dark:from-purple-900/60 dark:via-indigo-950/60 dark:to-slate-900 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 scale-[1.01]'
                          : appliedTemplate && formData.selectedCategory && formData.selectedCategory !== cat.id
                            ? 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/40 opacity-50 hover:opacity-75'
                            : 'bg-slate-50/70 hover:bg-white dark:bg-slate-950/70 dark:hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-slate-700'
                      }\`}`;

const newCatCardClass = `                      className={\`group relative p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between \${
                        isSelected
                          ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-sm ring-1 ring-purple-500/40'
                          : appliedTemplate && formData.selectedCategory && formData.selectedCategory !== cat.id
                            ? 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/40 opacity-40 hover:opacity-70'
                            : 'bg-white dark:bg-slate-900/80 hover:bg-purple-50/30 dark:hover:bg-slate-800/60 border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                      }\`}`;

if (content.includes(oldCatCardClass)) {
  content = content.replace(oldCatCardClass, newCatCardClass);
  console.log('Refined category card styling for pro look');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated GetStarted.jsx with pro designer aesthetics and cultural mascot art');
