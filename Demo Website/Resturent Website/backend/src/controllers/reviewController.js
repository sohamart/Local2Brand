import Review from '../models/Review.js';

export const getReviews = async (req, res, next) => {
  try {
    const query = { isHidden: false };
    if (req.tenantId) query.restaurantId = req.tenantId;
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const restaurantId = req.tenantId || req.body.restaurantId;
    const review = await Review.create({ ...req.body, restaurantId });
    res.status(201).json({ success: true, message: 'Review published.', data: review });
  } catch (error) {
    next(error);
  }
};
