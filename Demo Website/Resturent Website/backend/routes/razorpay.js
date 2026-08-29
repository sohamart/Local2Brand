const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');

// Helper to get Razorpay instance
function getRazorpayInstance() {
  const isEnabled = db.prepare("SELECT value FROM site_settings WHERE key = 'enable_razorpay'").get()?.value === 'true';
  const keyId = db.prepare("SELECT value FROM site_settings WHERE key = 'razorpay_key_id'").get()?.value || '';
  const keySecret = db.prepare("SELECT value FROM site_settings WHERE key = 'razorpay_key_secret'").get()?.value || '';

  if (!isEnabled) {
    return { enabled: false, instance: null, keyId: '' };
  }

  // Check if real or mock
  const hasValidKeys = keyId && keySecret && !keyId.includes('YourKeyHere') && !keySecret.includes('YourSecretKeyHere');
  
  if (hasValidKeys) {
    try {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });
      return { enabled: true, instance, keyId, isLive: true };
    } catch (e) {
      console.warn('Razorpay initialization failed, using sandbox fallback:', e.message);
    }
  }

  return { enabled: true, instance: null, keyId: keyId || 'rzp_test_simulated_key', isLive: false };
}

// Get Razorpay status and Public Key ID
router.get('/config', (req, res) => {
  try {
    const { enabled, keyId, isLive } = getRazorpayInstance();
    res.json({
      enabled,
      keyId,
      isLive: !!isLive
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Razorpay configuration' });
  }
});

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount in INR is required' });
    }

    const { enabled, instance, keyId, isLive } = getRazorpayInstance();

    if (!enabled) {
      return res.status(400).json({ error: 'Razorpay payment is currently disabled by administrator' });
    }

    // Convert amount to paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    if (isLive && instance) {
      // Real Razorpay API call
      const options = {
        amount: amountInPaise,
        currency,
        receipt,
        payment_capture: 1
      };

      const order = await instance.orders.create(options);
      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        isSimulated: false
      });
    } else {
      // Sandbox / Test Simulator order
      const mockOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return res.json({
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: keyId || 'rzp_test_simulated_key',
        isSimulated: true,
        message: 'Sandbox / Demo simulation mode active. (Configure live keys in Admin Settings anytime)'
      });
    }
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    res.status(500).json({ error: err.error?.description || 'Failed to initialize Razorpay payment order' });
  }
});

// Verify Payment Signature
router.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = db.prepare("SELECT value FROM site_settings WHERE key = 'razorpay_key_secret'").get()?.value || '';

    // If sandbox simulated order
    if (razorpay_order_id && razorpay_order_id.startsWith('order_sim_')) {
      return res.json({
        verified: true,
        message: 'Sandbox payment verified successfully',
        paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`
      });
    }

    if (!keySecret || keySecret.includes('YourSecretKeyHere')) {
      return res.json({
        verified: true,
        message: 'Test payment accepted (simulation)',
        paymentId: razorpay_payment_id || `pay_${Date.now()}`
      });
    }

    // Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ verified: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Signature verification error:', err);
    res.status(500).json({ error: 'Failed to verify payment signature' });
  }
});

module.exports = router;
