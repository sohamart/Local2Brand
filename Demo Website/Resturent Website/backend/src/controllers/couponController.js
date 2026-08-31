import Coupon from '../models/Coupon.js';

export const getCoupons = async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.tenantId) query.restaurantId = req.tenantId;
    const coupons = await Coupon.find(query);
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const query = { code: code.toUpperCase(), isActive: true };
    if (req.tenantId) query.restaurantId = req.tenantId;

    const coupon = await Coupon.findOne(query);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo code.' });
    }

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required.` });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      const computed = (subtotal * coupon.value) / 100;
      discount = Math.min(computed, coupon.maxDiscount || 9999);
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    res.json({ success: true, data: { coupon, discount } });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const restaurantId = req.tenantId || req.user.restaurantId;
    const coupon = await Coupon.create({ ...req.body, restaurantId, code: req.body.code.toUpperCase() });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};
