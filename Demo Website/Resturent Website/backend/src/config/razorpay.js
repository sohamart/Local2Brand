import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
} catch (e) {
  console.warn('[Razorpay] Running in Sandbox Mock Mode.');
}

export default razorpayInstance;
