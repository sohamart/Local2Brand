import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'none');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'local2brand@zohomail.in',
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '')
  }
});

async function main() {
  try {
    const verified = await transporter.verify();
    console.log('Verification success:', verified);

    const info = await transporter.sendMail({
      from: `"LOCAL2BRAND" <${process.env.EMAIL_USER}>`,
      to: 'sohamduttabwn@gmail.com',
      subject: 'LOCAL2BRAND Verification & Diagnostic',
      html: '<h1>Email Service Diagnostic</h1><p>Testing LOCAL2BRAND live email delivery.</p>'
    });

    console.log('Mail sent successfully! MessageId:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('Nodemailer Error caught:', err);
  }
}

main();
