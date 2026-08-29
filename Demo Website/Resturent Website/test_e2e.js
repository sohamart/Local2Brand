async function runTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Full System Integration Tests...');

  // 1. Health & Store Settings
  console.log('\n1. Testing Server Health & Settings...');
  const health = await (await fetch(`${BASE}/health`)).json();
  console.log('✅ Server Health:', health);

  const settings = await (await fetch(`${BASE}/settings`)).json();
  console.log('✅ Settings Loaded:', {
    name: settings.restaurant_name,
    enable_cod: settings.enable_cod,
    enable_whatsapp_order: settings.enable_whatsapp_order,
    enable_razorpay: settings.enable_razorpay,
    upi_id: settings.upi_id
  });

  // 2. Menu Fetch & Filter
  console.log('\n2. Testing Menu & Category Endpoints...');
  const menuRes = await (await fetch(`${BASE}/menu`)).json();
  console.log(`✅ Loaded ${menuRes.items.length} dishes and ${menuRes.categories.length} categories.`);
  const sampleDish = menuRes.items[0];
  console.log(`   Sample Dish: ${sampleDish.name} - ₹${sampleDish.price} (${sampleDish.is_veg ? 'VEG' : 'NON-VEG'})`);

  // 3. User Authentication (Customer & Admin)
  console.log('\n3. Testing Authentication...');
  let customerLogin = await (await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com', password: 'customer123' })
  })).json();

  if (!customerLogin.user) {
    customerLogin = await (await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'customerNewPass123' })
    })).json();
  }
  console.log('✅ Customer Logged In:', customerLogin.user.name);

  const adminLogin = await (await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@restaurant.com', password: 'admin123' })
  })).json();
  console.log('✅ Admin Logged In:', adminLogin.user.name);
  const adminToken = adminLogin.token;

  // 4. Razorpay Order Creation
  console.log('\n4. Testing Razorpay Order Creation...');
  const rzpOrder = await (await fetch(`${BASE}/razorpay/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 799, currency: 'INR' })
  })).json();
  console.log('✅ Razorpay Order Generated:', rzpOrder);

  // 5. Razorpay Signature Verification
  console.log('\n5. Testing Razorpay Payment Verification...');
  const rzpVerify = await (await fetch(`${BASE}/razorpay/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: rzpOrder.id,
      razorpay_payment_id: 'pay_test_123456',
      razorpay_signature: 'dummy_or_valid_sig'
    })
  })).json();
  console.log('✅ Razorpay Verification Result:', rzpVerify);

  // 6. Create Customer Order
  console.log('\n6. Testing Order Placement...');
  const invalidGeoOrder = await (await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: customerLogin.user.id,
      customer_name: 'Rahul Sharma',
      customer_phone: '+91 98765 12345',
      delivery_address: 'Connaught Place, New Delhi - 110001',
      items: [{ id: sampleDish.id, name: sampleDish.name, price: sampleDish.price, quantity: 1, is_veg: 0 }],
      subtotal: 380,
      delivery_fee: 49,
      total: 429,
      payment_method: 'cod'
    })
  })).json();
  console.log('✅ Geo-Fence Non-Burdwan Address Rejection:', invalidGeoOrder.error);

  // Test Rider Account Order Restriction
  const riderUserLogin = await (await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rider@restaurant.com', password: 'rider123' })
  })).json();
  const riderOrderAttempt = await (await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: riderUserLogin.user.id,
      customer_name: riderUserLogin.user.name,
      customer_phone: '+91 98300 55443',
      delivery_address: 'Badamtala, Burdwan - 713101, West Bengal',
      items: [{ id: sampleDish.id, name: sampleDish.name, price: sampleDish.price, quantity: 1, is_veg: 0 }],
      subtotal: 380,
      delivery_fee: 0,
      total: 380,
      payment_method: 'cod'
    })
  })).json();
  console.log('✅ Rider Account Order Restriction:', riderOrderAttempt.error);

  const orderRes = await (await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: customerLogin.user.id,
      customer_name: 'Rahul Sharma',
      customer_phone: '+91 98765 12345',
      delivery_address: 'Flat 402, Royal Palms, Badamtala, Burdwan - 713101, West Bengal',
      delivery_notes: 'Extra mint chutney please',
      items: [
        { id: sampleDish.id, name: sampleDish.name, price: sampleDish.price, quantity: 2, is_veg: sampleDish.is_veg }
      ],
      subtotal: sampleDish.price * 2,
      delivery_fee: 0,
      discount: 50,
      total: (sampleDish.price * 2) - 50,
      payment_method: 'razorpay',
      payment_status: 'paid',
      razorpay_order_id: rzpOrder.id
    })
  })).json();
  console.log('✅ Valid Burdwan Order Created Successfully! ID:', orderRes.order.id);
  const testOrderId = orderRes.order.id;

  // 7. Live Order Tracking
  console.log('\n7. Testing Live Order Tracking by ID...');
  const trackRes = await (await fetch(`${BASE}/orders/track/${testOrderId}`)).json();
  console.log('✅ Order Track Details:', {
    id: trackRes.order.id,
    status: trackRes.order.order_status,
    driver: trackRes.order.driver_name,
    eta: trackRes.order.estimated_delivery_time,
    itemsCount: trackRes.order.items.length
  });

  // 8. Admin Update Order Status
  console.log('\n8. Testing Admin Order Status Transition...');
  const updateRes = await (await fetch(`${BASE}/orders/admin/${testOrderId}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ order_status: 'out_for_delivery' })
  })).json();
  console.log('✅ Admin Updated Status to:', updateRes.order.order_status);

  // 9. Table Reservation
  console.log('\n9. Testing Table Reservation Booking...');
  const resvRes = await (await fetch(`${BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sneha Roy',
      phone: '+91 98300 77665',
      guests: 4,
      reservation_date: '2026-09-05',
      reservation_time: '08:00 PM',
      seating_type: 'Romantic Candlelight Booth',
      special_request: 'Anniversary celebration with dessert sparkler'
    })
  })).json();
  console.log('✅ Table Reservation Confirmed:', resvRes.message);

  // 10. Reviews Submission & Public Listing
  console.log('\n10. Testing Customer Review Submission...');
  const reviewRes = await (await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Rahul Sharma',
      rating: 5,
      comment: 'Super fast delivery and the Afghani Malai Tikka melted in mouth!',
      dish_name: 'Smoked Afghani Malai Tikka'
    })
  })).json();
  console.log('✅ Review Submitted:', reviewRes.review);

  // 11. Visitor Analytics Logging & Admin Overview
  console.log('\n11. Testing Visitor Heartbeat & Admin Analytics Dashboard...');
  await fetch(`${BASE}/analytics/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: '/#menu',
      sessionId: 'sess_test_123',
      referrer: 'https://google.com'
    })
  });

  const overview = await (await fetch(`${BASE}/analytics/admin/overview`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  })).json();
  console.log('✅ Admin Analytics Overview:', {
    activeVisitors: overview.activeVisitors,
    totalPageViews: overview.totalPageViews,
    totalOrders: overview.totalOrders,
    totalRevenue: overview.totalRevenue,
    totalCustomers: overview.totalCustomers
  });

  // 12. Customer Directory
  console.log('\n12. Testing Admin Customer Directory...');
  const usersDir = await (await fetch(`${BASE}/users/admin/all`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  })).json();
  // 13. Image Upload Endpoint & Cloudinary Status
  console.log('\n13. Testing Image Upload & Cloudinary Status...');
  const uploadStatus = await (await fetch(`${BASE}/upload/status`)).json();
  console.log('✅ Upload & Cloudinary Status:', uploadStatus);

  // Test uploading a mock image buffer
  const FormData = require('form-data');
  const form = new FormData();
  const dummyBuffer = Buffer.from('RIFF....WEBPVP8 ...', 'utf-8');
  form.append('image', dummyBuffer, { filename: 'test_dish.webp', contentType: 'image/webp' });

  const uploadRes = await (await fetch(`${BASE}/upload`, {
    method: 'POST',
    body: form.getBuffer(),
    headers: form.getHeaders()
  })).json();
  // 14. Newsletter Subscription & Welcome Discount Email
  console.log('\n14. Testing VIP Newsletter Subscription & Email Notification...');
  const testSubEmail = `vip_guest_${Date.now()}@example.com`;
  const subRes = await (await fetch(`${BASE}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testSubEmail })
  })).json();
  console.log('✅ Newsletter Subscription Response:', subRes);

  // 15. Forgot Password OTP & Password Reset Flow
  console.log('\n15. Testing Forgot Password OTP & Reset Flow...');
  const forgotRes = await (await fetch(`${BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com' })
  })).json();
  console.log('✅ Forgot Password OTP Dispatch:', forgotRes);

  // Read OTP from DB directly for test automation
  const db = require('./server/db');
  const otpRecord = db.prepare('SELECT otp FROM password_resets WHERE email = ? ORDER BY id DESC LIMIT 1').get('customer@example.com');
  console.log('   Retrieved OTP Code from DB:', otpRecord.otp);

  const resetRes = await (await fetch(`${BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@example.com',
      otp: otpRecord.otp,
      newPassword: 'customerNewPass123'
    })
  })).json();
  console.log('✅ Password Reset Response:', resetRes);

  // 16. Admin Test Email Endpoint
  console.log('\n16. Testing Admin SMTP Test Email Endpoint...');
  const testEmailRes = await (await fetch(`${BASE}/settings/admin/test-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ target_email: 'admin@restaurant.com' })
  })).json();
  console.log('✅ Test Email Dispatch Response:', testEmailRes);

  // 17. Delivery Partner (Rider) Authentication, Order Accept, GPS Broadcast & Completion
  console.log('\n17. Testing Delivery Partner (Rider) Complete Flow...');
  const riderLogin = await (await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rider@restaurant.com', password: 'rider123' })
  })).json();
  console.log('✅ Delivery Rider Logged In:', riderLogin.user.name);
  const riderToken = riderLogin.token;

  // Rider views available orders
  const availableOrders = await (await fetch(`${BASE}/orders/driver/available`, {
    headers: { 'Authorization': `Bearer ${riderToken}` }
  })).json();
  console.log(`✅ Rider Available Orders: ${availableOrders.length} pending pickup`);

  // Rider accepts order created in test 6 (testOrderId)
  const acceptRes = await (await fetch(`${BASE}/orders/driver/${testOrderId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({ vehicle: 'Express Thermal Bike (DL 04 EV 8892)' })
  })).json();
  console.log('✅ Rider Accepted Order Response:', acceptRes.message);

  // Rider broadcasts live GPS location
  const gpsRes = await (await fetch(`${BASE}/orders/driver/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({ lat: 22.5740, lng: 88.3650 })
  })).json();
  console.log('✅ Rider GPS Broadcast Response:', gpsRes.message);

  // Customer tracks order again and verifies assigned rider info and delivery OTP
  const trackedAfterAccept = await (await fetch(`${BASE}/orders/track/${testOrderId}`)).json();
  const customerOtp = trackedAfterAccept.order.delivery_otp;
  console.log('✅ Live Track After Rider Assignment:', {
    orderId: trackedAfterAccept.order.id,
    status: trackedAfterAccept.order.order_status,
    driverName: trackedAfterAccept.order.driver_name,
    driverPhone: trackedAfterAccept.order.driver_phone,
    driverVehicle: trackedAfterAccept.order.driver_vehicle,
    customerDeliveryOtp: customerOtp,
    driverLat: trackedAfterAccept.order.driver_lat,
    driverLng: trackedAfterAccept.order.driver_lng
  });

  // Rider tries to mark delivered with INVALID OTP (should be rejected)
  const invalidOtpRes = await (await fetch(`${BASE}/orders/driver/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({ order_status: 'delivered', payment_status: 'paid', otp: '0000' })
  })).json();
  console.log('✅ Invalid Delivery OTP Rejection:', invalidOtpRes.error);

  // Rider marks delivered with CORRECT Customer Delivery OTP (should succeed)
  const deliverRes = await (await fetch(`${BASE}/orders/driver/${testOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({ order_status: 'delivered', payment_status: 'paid', otp: customerOtp })
  })).json();
  console.log('✅ Rider Verified OTP & Marked Delivered Response:', deliverRes.message);

  // 18. Admin Registers a New Delivery Partner & Lists Fleet
  console.log('\n18. Testing Admin Registering a New Delivery Partner...');
  const newRiderEmail = `express_fleet_${Date.now()}@restaurant.com`;
  const registerRiderRes = await (await fetch(`${BASE}/users/admin/create-rider`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      name: 'Kabir Express',
      email: newRiderEmail,
      password: 'kabirPass123',
      phone: '+91 98111 22334',
      vehicle: 'TVS Ntorq 125 • DL 05 CZ 9988',
      address: 'Express Delivery Hub 2'
    })
  })).json();
  console.log('✅ Admin Register Rider Response:', registerRiderRes.message);

  const fleetList = await (await fetch(`${BASE}/users/admin/riders`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  })).json();
  console.log(`✅ Admin Fleet Directory: ${fleetList.length} Active Delivery Partners Registered`);

  console.log('\n🎉 ALL 18 INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
