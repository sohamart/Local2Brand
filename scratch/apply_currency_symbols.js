const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'GetStarted.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace standard currency symbol in bottom bar and cards
// In bottom bar:
content = content.replace(
  `₹{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}`,
  `{currentCountryTheme.symbol}{priceBreakdown.totalApproxPrice.toLocaleString('en-IN')}`
);
content = content.replace(
  `₹{priceBreakdown.subtotal.toLocaleString('en-IN')}`,
  `{currentCountryTheme.symbol}{priceBreakdown.subtotal.toLocaleString('en-IN')}`
);

// In category cards:
content = content.replace(
  `<span className="font-bold text-emerald-600 dark:text-emerald-400">₹{cat.basePrice.toLocaleString('en-IN')}</span>`,
  `<span className="font-bold text-emerald-600 dark:text-emerald-400">{currentCountryTheme.symbol}{cat.basePrice.toLocaleString('en-IN')}</span>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Currency symbols updated to dynamic country theme symbol!');
