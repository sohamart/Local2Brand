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

  // Ensure default code is present
  if (!coupons[defaultCode.toUpperCase()]) {
    coupons[defaultCode.toUpperCase()] = defaultDiscount;
  }

  return coupons;
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
