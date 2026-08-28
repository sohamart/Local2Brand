/**
 * Dynamic Coupon Codes Engine for LOCAL2BRAND
 * Sources active coupon codes and discount percentages dynamically from .env!
 */

export const getAvailableCoupons = () => {
  const envList = import.meta.env.VITE_COUPONS_LIST || 'INDIA2025:20,LAUNCH20:20,FESTIVE25:25,STARTUP30:30,VIP50:50';
  const defaultCode = import.meta.env.VITE_DEFAULT_PROMO_CODE || 'INDIA2025';
  const defaultDiscount = parseInt(import.meta.env.VITE_DEFAULT_PROMO_DISCOUNT || '20', 10);

  const coupons = {};

  try {
    envList.split(',').forEach((item) => {
      const [code, disc] = item.trim().split(':');
      if (code && disc) {
        coupons[code.toUpperCase()] = parseInt(disc, 10);
      }
    });
  } catch (e) {
    console.error('Error parsing VITE_COUPONS_LIST', e);
  }

  // Ensure default code is present if not defined
  if (!coupons[defaultCode.toUpperCase()]) {
    coupons[defaultCode.toUpperCase()] = defaultDiscount;
  }

  return coupons;
};

/**
 * Returns list of featured/clickable coupons for the UI pill badges
 * Driven by VITE_SHOW_FEATURED_COUPONS or entire VITE_COUPONS_LIST
 */
export const getFeaturedCouponsList = () => {
  const allCoupons = getAvailableCoupons();
  const featuredEnv = import.meta.env.VITE_SHOW_FEATURED_COUPONS;

  if (featuredEnv && typeof featuredEnv === 'string') {
    const requestedCodes = featuredEnv.split(',').map(c => c.trim().toUpperCase());
    const list = [];
    requestedCodes.forEach(code => {
      if (allCoupons[code]) {
        list.push({
          code,
          discountPercent: allCoupons[code],
          label: `${code} (${allCoupons[code]}% OFF)`
        });
      }
    });
    if (list.length > 0) return list;
  }

  // Otherwise return top 3 from allCoupons
  return Object.entries(allCoupons).slice(0, 4).map(([code, discount]) => ({
    code,
    discountPercent: discount,
    label: `${code} (${discount}% OFF)`
  }));
};

/**
 * Validate a coupon code against .env configuration
 * Returns { valid: boolean, discountPercent: number, code: string, message: string }
 */
export const validateCouponCode = (rawCode) => {
  if (!rawCode || typeof rawCode !== 'string') {
    return { valid: false, discountPercent: 0, code: '', message: 'Please enter a coupon code.' };
  }

  const cleanCode = rawCode.trim().toUpperCase();
  const coupons = getAvailableCoupons();

  if (coupons[cleanCode]) {
    const discount = coupons[cleanCode];
    return {
      valid: true,
      discountPercent: discount,
      code: cleanCode,
      message: `🎉 Coupon "${cleanCode}" applied: Flat ${discount}% OFF activated!`
    };
  }

  return {
    valid: false,
    discountPercent: 0,
    code: cleanCode,
    message: `⚠️ "${cleanCode}" is invalid or expired. Try using "${import.meta.env.VITE_DEFAULT_PROMO_CODE || 'INDIA2025'}".`
  };
};

export const getDefaultPromoCode = () => {
  return import.meta.env.VITE_DEFAULT_PROMO_CODE || 'INDIA2025';
};

export const getDefaultDiscountPercent = () => {
  return parseInt(import.meta.env.VITE_DEFAULT_PROMO_DISCOUNT || '20', 10);
};

export const getAvailableCouponsLabel = () => {
  return import.meta.env.VITE_AVAILABLE_COUPONS_LABEL || 'Available Offers:';
};

export const getCouponSectionTitle = () => {
  return import.meta.env.VITE_COUPON_SECTION_TITLE || 'Have a Promo Coupon Code?';
};
