
async function testAll() {
  console.log('Testing End-to-End API Workflows...');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Test Callback Creation
  console.log('\n--- 1. Testing Callback Creation ---');
  try {
    const cbRes = await fetch(`${BASE_URL}/callbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Soham Dutta (Test Lead)',
        phone: '9876543210',
        email: 'sohamduttabwn@gmail.com',
        preferredTime: 'Today, 4:00 PM',
        topic: 'E-commerce website with payment gateway and WhatsApp orders',
      }),
    });
    const cbData = await cbRes.json();
    console.log('Callback Response:', cbData);
  } catch (e) {
    console.error('Callback error:', e.message);
  }

  // 2. Test Requirement Creation (Get Started Form submission)
  console.log('\n--- 2. Testing Requirement Draft & Submission ---');
  let reqId = null;
  try {
    const draftRes = await fetch(`${BASE_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteType: 'restaurant',
        websiteTypeName: 'Restaurant & Cloud Kitchen',
        selectedPages: ['Home', 'Menu', 'Online Order', 'Contact Us'],
        adminPanelType: 'custom_pro',
        timeline: '⚡ Express (48 - 72 Hours)',
        budget: '₹12,999 – ₹24,999',
        clientInfo: {
          businessName: 'Royal Bengal Biryani & Sweets',
          ownerName: 'Subhamoy Sen',
          email: 'subhamoy@example.com',
          mobile: '9876512345'
        }
      })
    });
    const draftData = await draftRes.json();
    reqId = draftData.requirementId;
    console.log('Requirement Draft Created:', reqId);

    // Finalize submission
    const submitRes = await fetch(`${BASE_URL}/requirements/${reqId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draftData.requirement,
        additionalNotes: 'Need WhatsApp automated invoice and instant order push notifications.'
      })
    });
    const submitData = await submitRes.json();
    console.log('Requirement Submit Data:', submitData);
  } catch (e) {
    console.error('Requirement submission error:', e.message);
  }

  // 3. Test Track Order by Requirement ID
  if (reqId) {
    console.log('\n--- 3. Testing Track Order by ID ---');
    try {
      const trackRes = await fetch(`${BASE_URL}/requirements/${reqId}`);
      const trackData = await trackRes.json();
      console.log('Track Order Data Found:', trackData.success, trackData.requirement?.requirementId, trackData.requirement?.status);
    } catch (e) {
      console.error('Track order error:', e.message);
    }
  }

  // 4. Test AI Chat with project requirement auto-detection
  console.log('\n--- 4. Testing AI Chat Auto-Order Detection ---');
  try {
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Amar ekta salon business ache, amar ekta appointment booking website dorkar, amar phone number holo 9876599999 r email holo salonpro@gmail.com',
        sessionId: `test_sess_${Date.now()}`
      })
    });
    const chatData = await chatRes.json();
    console.log('AI Chat Response:');
    console.log('Provider:', chatData.provider);
    console.log('Requirement Created:', chatData.requirementCreated, 'ID:', chatData.requirementId);
    console.log('Message snippet:', chatData.message?.slice(0, 250) + '...');
  } catch (e) {
    console.error('AI chat error:', e.message);
  }

  // 5. Test Admin Stats
  console.log('\n--- 5. Testing Admin Stats ---');
  try {
    const statsRes = await fetch(`${BASE_URL}/admin/stats`);
    const statsData = await statsRes.json();
    console.log('Admin Stats:', statsData.stats);
    console.log('Recent Requirements count:', statsData.recentRequirements?.length);
    console.log('Recent Callbacks count:', statsData.recentCallbacks?.length);
  } catch (e) {
    console.error('Admin stats error:', e.message);
  }

  console.log('\n✅ Verification Complete!');
}

testAll();
