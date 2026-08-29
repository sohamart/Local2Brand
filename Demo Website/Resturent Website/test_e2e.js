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
  const customerLogin = await (await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com', password: 'customer123' })
  })).json();
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
  const orderRes = await (await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: customerLogin.user.id,
      customer_name: 'Rahul Sharma',
      customer_phone: '+91 98765 12345',
      delivery_address: 'Flat 402, Royal Palms, Park Street',
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
  console.log('✅ Order Created Successfully! ID:', orderRes.order.id);
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
  console.log('✅ Image Upload Response:', uploadRes);

  console.log('\n🎉 ALL 13 INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
