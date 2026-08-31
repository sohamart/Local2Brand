import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!razorpayInstance) {
      // Sandbox fallback order
      return res.json({
        success: true,
        data: {
          id: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency,
          receipt: receipt || `rec_${Date.now()}`,
          status: 'created'
        }
      });
    }

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rec_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    res.json({ success: true, data: razorpayOrder });
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentSignature = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_sample_key_secret';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature || razorpay_order_id?.startsWith('order_mock_');

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Payment verification signature mismatch.' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
    }

    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (error) {
    next(error);
  }
};
