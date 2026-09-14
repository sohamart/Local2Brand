import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sohamduttabwn@gmail.com',
    pass: 'qiktqqffxsxccirj',
  },
});

async function run() {
  console.log('Testing 1: from = webletscontact@gmail.com');
  try {
    const info1 = await transporter.sendMail({
      from: `"WEBLETS" <webletscontact@gmail.com>`,
      to: 'duttasohambwn@gmail.com',
      subject: 'Test 1: From webletscontact',
      text: 'Testing with from webletscontact',
    });
    console.log('✅ Test 1 Success! MessageId:', info1.messageId, 'Accepted:', info1.accepted);
  } catch (e) {
    console.error('❌ Test 1 Error:', e.message);
  }

  console.log('\nTesting 2: from = sohamduttabwn@gmail.com');
  try {
    const info2 = await transporter.sendMail({
      from: `"WEBLETS" <sohamduttabwn@gmail.com>`,
      to: 'duttasohambwn@gmail.com',
      subject: 'Test 2: From sohamduttabwn',
      text: 'Testing with from sohamduttabwn',
    });
    console.log('✅ Test 2 Success! MessageId:', info2.messageId, 'Accepted:', info2.accepted);
  } catch (e) {
    console.error('❌ Test 2 Error:', e.message);
  }
}

run();
