import express from 'express';
import { protect } from '../middlewares/auth.js';
import { resolveTenant } from '../middlewares/tenant.js';

// Controllers
import * as authCtrl from '../controllers/authController.js';
import * as restCtrl from '../controllers/restaurantController.js';
import * as prodCtrl from '../controllers/productController.js';
import * as ordCtrl from '../controllers/orderController.js';
import * as payCtrl from '../controllers/paymentController.js';
import * as tblCtrl from '../controllers/tableController.js';
import * as cpnCtrl from '../controllers/couponController.js';
import * as revCtrl from '../controllers/reviewController.js';
import * as anCtrl from '../controllers/analyticsController.js';

const router = express.Router();

router.use(resolveTenant);

// 1. Auth Routes
router.post('/auth/register', authCtrl.registerUser);
router.post('/auth/login', authCtrl.loginUser);
router.get('/auth/me', protect, authCtrl.getMe);

// 2. Multi-Tenant Restaurant Routes
router.get('/restaurants', restCtrl.getRestaurants);
router.get('/restaurants/:slug', restCtrl.getRestaurantBySlug);
router.post('/restaurants', restCtrl.createRestaurant);
router.put('/restaurants/:id/theme', restCtrl.updateRestaurantTheme);

// 3. Products / Menu Routes
router.get('/products', prodCtrl.getProducts);
router.get('/products/:slug', prodCtrl.getProductBySlug);
router.post('/products', protect, prodCtrl.createProduct);
router.delete('/products/:id', protect, prodCtrl.deleteProduct);

// 4. Orders Routes
router.post('/orders', ordCtrl.createOrder);
router.get('/orders', ordCtrl.getOrders);
router.get('/orders/:id', ordCtrl.getOrderById);
router.put('/orders/:id/status', ordCtrl.updateOrderStatus);

// 5. Payment Routes (Razorpay & Webhooks)
router.post('/payments/razorpay/create-order', payCtrl.createRazorpayOrder);
router.post('/payments/razorpay/verify', payCtrl.verifyPaymentSignature);

// 6. Tables & Reservations
router.get('/tables', tblCtrl.getTables);
router.post('/tables', protect, tblCtrl.createTable);
router.get('/reservations', tblCtrl.getReservations);
router.post('/reservations', tblCtrl.createReservation);

// 7. Coupons
router.get('/coupons', cpnCtrl.getCoupons);
router.post('/coupons/validate', cpnCtrl.validateCoupon);
router.post('/coupons', protect, cpnCtrl.createCoupon);

// 8. Reviews
router.get('/reviews', revCtrl.getReviews);
router.post('/reviews', revCtrl.createReview);

// 9. Analytics
router.get('/analytics', anCtrl.getAnalytics);

export default router;
