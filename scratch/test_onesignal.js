async function testPush() {
  try {
    const res = await fetch('http://localhost:5000/api/notifications/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: 'broadcast',
        title: '🚀 LOCAL2BRAND Test Push Notification',
        message: 'Hello from LOCAL2BRAND! Your OneSignal push setup is fully operational.',
        url: 'https://local2brand.com',
      }),
    });

    const data = await res.json();
    console.log('Test Push Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testPush();
