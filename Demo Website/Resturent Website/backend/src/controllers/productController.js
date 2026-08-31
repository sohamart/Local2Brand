import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res, next) => {
  try {
    const query = {};

    if (req.tenantId) query.restaurantId = req.tenantId;
    if (req.query.categoryId) query.categoryId = req.query.categoryId;
    if (req.query.isVeg) query.isVeg = req.query.isVeg === 'true';
    if (req.query.isFeatured) query.isFeatured = req.query.isFeatured === 'true';
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ isFeatured: -1, isBestseller: -1, createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const query = { slug };
    if (req.tenantId) query.restaurantId = req.tenantId;

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const restaurantId = req.tenantId || req.user.restaurantId;
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-');

    const product = await Product.create({
      ...req.body,
      restaurantId,
      slug
    });

    res.status(201).json({ success: true, message: 'Dish added to menu.', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Dish removed from menu.' });
  } catch (error) {
    next(error);
  }
};
