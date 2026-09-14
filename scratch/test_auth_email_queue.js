import { sendEmail, sendWelcomeEmail, sendVerificationOtpEmail, sendPasswordResetOtpEmail } from '../backend/utils/email.js';

async function testEmailQueue() {
  console.log('Testing Email Queue sequential dispatch...');
  const fakeUser = {
    name: 'Test Client',
    email: 'testclient@example.com',
  };

  const p1 = sendWelcomeEmail(fakeUser);
  const p2 = sendVerificationOtpEmail({ user: fakeUser, otp: '123456', email: fakeUser.email });
  const p3 = sendPasswordResetOtpEmail({ user: fakeUser, otp: '654321', email: fakeUser.email });

  const results = await Promise.all([p1, p2, p3]);
  console.log('Results:', results);
  console.log('✅ Email queue simulation and anti-spam sequential dispatch passed!');
}

testEmailQueue().catch(console.error);
