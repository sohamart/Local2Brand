// Smart Automatic IP & Timezone Country & Location Detector

export const ISO_TO_COUNTRY_MAP = {
  'IN': 'India',
  'BD': 'Bangladesh',
  'AE': 'United Arab Emirates',
  'US': 'United States',
  'GB': 'United Kingdom',
  'UK': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'SG': 'Singapore',
  'DE': 'Germany'
};

export const TIMEZONE_TO_COUNTRY_MAP = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'Asia/Dhaka': 'Bangladesh',
  'Asia/Dubai': 'United Arab Emirates',
  'Europe/London': 'United Kingdom',
  'Asia/Singapore': 'Singapore',
  'Europe/Berlin': 'Germany',
  'Europe/Busingen': 'Germany'
};

export function detectCountryFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (!tz) return 'India';

    if (TIMEZONE_TO_COUNTRY_MAP[tz]) {
      return TIMEZONE_TO_COUNTRY_MAP[tz];
    }

    if (tz.startsWith('Australia/')) return 'Australia';
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('America/Montreal') || tz.startsWith('America/Edmonton') || tz.startsWith('America/Winnipeg') || tz.startsWith('America/Halifax')) return 'Canada';
    if (tz.startsWith('America/') || tz.startsWith('US/')) return 'United States';
    if (tz.startsWith('Europe/Berlin') || tz.startsWith('Europe/Frankfurt')) return 'Germany';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'India';

    return 'India';
  } catch (e) {
    return 'India';
  }
}

export function normalizeCountryName(rawCountry, rawCountryCode) {
  if (!rawCountry && !rawCountryCode) return null;

  const code = (rawCountryCode || '').toUpperCase().trim();
  if (ISO_TO_COUNTRY_MAP[code]) {
    return ISO_TO_COUNTRY_MAP[code];
  }

  const name = (rawCountry || '').toLowerCase().trim();
  if (name.includes('india') || name.includes('bharat')) return 'India';
  if (name.includes('bangladesh') || name.includes('dhaka')) return 'Bangladesh';
  if (name.includes('emirates') || name.includes('uae') || name.includes('dubai') || name.includes('abu dhabi')) return 'United Arab Emirates';
  if (name.includes('united states') || name.includes('usa') || name === 'us') return 'United States';
  if (name.includes('united kingdom') || name.includes('uk') || name.includes('britain') || name.includes('england')) return 'United Kingdom';
  if (name.includes('canada')) return 'Canada';
  if (name.includes('australia')) return 'Australia';
  if (name.includes('singapore')) return 'Singapore';
  if (name.includes('germany') || name.includes('deutschland')) return 'Germany';

  return 'Other';
}

/**
 * Detect live user country and location via IP with instant Timezone fallback
 */
export async function detectUserLiveLocation() {
  // 1. Instant Timezone fallback
  const timezoneCountry = detectCountryFromTimezone();
  let detectedInfo = {
    country: timezoneCountry,
    countryCode: '',
    state: '',
    city: '',
    source: 'timezone'
  };

  // 2. Fast IP Geolocation with Promise.race & Timeout
  const fetchWithTimeout = (url, timeoutMs = 2500) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Geo fetch timeout')), timeoutMs);
      fetch(url)
        .then(res => {
          clearTimeout(timer);
          if (res.ok) return res.json();
          reject(new Error('Network response not ok'));
        })
        .then(data => resolve(data))
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  // Try ipapi.co first
  try {
    const data = await fetchWithTimeout('https://ipapi.co/json/', 2000);
    if (data && (data.country_name || data.country_code)) {
      const matched = normalizeCountryName(data.country_name, data.country_code);
      if (matched) {
        return {
          country: matched,
          countryCode: data.country_code || '',
          state: data.region || '',
          city: data.city || '',
          source: 'ipapi'
        };
      }
    }
  } catch (err) {
    // Fall through to backup
  }

  // Backup: ipwho.is
  try {
    const data = await fetchWithTimeout('https://ipwho.is/', 2000);
    if (data && data.success && (data.country || data.country_code)) {
      const matched = normalizeCountryName(data.country, data.country_code);
      if (matched) {
        return {
          country: matched,
          countryCode: data.country_code || '',
          state: data.region || '',
          city: data.city || '',
          source: 'ipwhois'
        };
      }
    }
  } catch (err) {
    // Fall through to backup 2
  }

  // Backup 2: api.country.is
  try {
    const data = await fetchWithTimeout('https://api.country.is/', 1800);
    if (data && data.country) {
      const matched = normalizeCountryName(null, data.country);
      if (matched) {
        return {
          country: matched,
          countryCode: data.country || '',
          state: '',
          city: '',
          source: 'country.is'
        };
      }
    }
  } catch (err) {
    // return timezone fallback
  }

  return detectedInfo;
}
