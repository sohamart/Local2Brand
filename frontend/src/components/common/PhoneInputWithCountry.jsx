import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

export const COUNTRY_CODES = [
  { code: 'IN', name: 'India', dialCode: '+91', flagCode: 'in', digits: 10, pattern: '^[6-9]\\d{9}$', placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dialCode: '+1', flagCode: 'us', digits: 10, pattern: '^\\d{10}$', placeholder: '202 555 0123' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flagCode: 'gb', digits: 10, pattern: '^\\d{10,11}$', placeholder: '7911 123456' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flagCode: 'ae', digits: 9, pattern: '^\\d{9}$', placeholder: '50 123 4567' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flagCode: 'bd', digits: 10, pattern: '^\\d{10}$', placeholder: '1712 345678' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flagCode: 'sa', digits: 9, pattern: '^\\d{9}$', placeholder: '50 123 4567' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flagCode: 'au', digits: 9, pattern: '^\\d{9}$', placeholder: '412 345 678' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flagCode: 'ca', digits: 10, pattern: '^\\d{10}$', placeholder: '416 555 0123' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flagCode: 'sg', digits: 8, pattern: '^\\d{8}$', placeholder: '8123 4567' },
  { code: 'GLOBAL', name: 'International', dialCode: '+', flagCode: 'un', digits: null, pattern: '^\\d{7,15}$', placeholder: 'Phone Number' },
];

export function validatePhoneNumber(rawNumber, countryCode = 'IN') {
  const digitsOnly = String(rawNumber || '').replace(/\D/g, '');
  const country = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  if (!digitsOnly) {
    return { valid: false, message: 'Phone number is required.' };
  }

  if (country.code === 'IN') {
    if (digitsOnly.length !== 10) {
      return { valid: false, message: `Indian mobile number must be 10 digits (currently ${digitsOnly.length}).` };
    }
    if (!/^[6-9]/.test(digitsOnly)) {
      return { valid: false, message: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
    }
  } else if (country.digits) {
    if (digitsOnly.length !== country.digits) {
      return { valid: false, message: `${country.name} phone number must be ${country.digits} digits.` };
    }
  } else {
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return { valid: false, message: 'International phone numbers must be between 7 and 15 digits.' };
    }
  }

  return { valid: true, message: 'Valid phone number', formatted: `${country.dialCode} ${digitsOnly}` };
}

export default function PhoneInputWithCountry({
  value,
  onChange,
  countryCode = 'IN',
  onCountryChange,
  required = true,
  className = '',
  id = 'phone-input'
}) {
  const [selectedCountry, setSelectedCountry] = useState(() =>
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0]
  );

  useEffect(() => {
    if (countryCode) {
      const found = COUNTRY_CODES.find((c) => c.code === countryCode);
      if (found && found.code !== selectedCountry.code) {
        setSelectedCountry(found);
      }
    }
  }, [countryCode]);

  const handleCountrySelect = (e) => {
    const chosen = COUNTRY_CODES.find((c) => c.code === e.target.value) || COUNTRY_CODES[0];
    setSelectedCountry(chosen);
    if (onCountryChange) onCountryChange(chosen.code);
  };

  const handleNumberInput = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, '');
    const maxLen = selectedCountry.digits ? selectedCountry.digits : 15;
    const truncated = cleanDigits.slice(0, maxLen);
    onChange(truncated, selectedCountry.dialCode);
  };

  const currentDigits = String(value || '').replace(/\D/g, '');
  const validation = validatePhoneNumber(currentDigits, selectedCountry.code);
  const isValid = currentDigits.length > 0 && validation.valid;
  const isInvalid = currentDigits.length > 0 && !validation.valid;

  const flagUrl = selectedCountry.flagCode === 'un'
    ? 'https://flagcdn.com/w40/un.png'
    : `https://flagcdn.com/w40/${selectedCountry.flagCode}.png`;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all shadow-2xs">
        
        {/* Country Flag & Dial Code Selector */}
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-700 pl-3 pr-2.5 py-2 shrink-0 gap-1.5 cursor-pointer group">
          <img
            src={flagUrl}
            alt={selectedCountry.name}
            className="w-5 h-3.5 object-cover rounded shadow-2xs shrink-0 ring-1 ring-black/10 dark:ring-white/10"
            loading="eager"
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
            {selectedCountry.dialCode}
          </span>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 pointer-events-none transition-colors" />

          {/* Invisible Overlay Select */}
          <select
            value={selectedCountry.code}
            onChange={handleCountrySelect}
            aria-label="Select Country Code"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>

        {/* Numeric Phone Input */}
        <div className="relative flex-1 flex items-center">
          <input
            id={id}
            type="tel"
            required={required}
            value={value || ''}
            onChange={handleNumberInput}
            placeholder={selectedCountry.placeholder}
            className="w-full px-3.5 py-2.5 bg-transparent text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans focus:outline-none"
          />

          {/* Validation Status Indicator */}
          {isValid && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3 shrink-0 animate-in zoom-in-50" />
          )}
          {isInvalid && (
            <AlertCircle className="w-4 h-4 text-amber-500 mr-3 shrink-0 animate-in zoom-in-50" />
          )}
        </div>
      </div>

      {/* Helper digit requirement hint */}
      <div className="flex items-center justify-between text-[10px] px-1 font-semibold">
        <span className={isInvalid ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
          {isInvalid ? validation.message : `${selectedCountry.name}: ${selectedCountry.digits ? `${selectedCountry.digits} digits required` : 'International number'}`}
        </span>
        {selectedCountry.digits && (
          <span className={`font-mono ${currentDigits.length === selectedCountry.digits ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
            {currentDigits.length}/{selectedCountry.digits}
          </span>
        )}
      </div>
    </div>
  );
}
