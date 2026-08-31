import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (host && user && pass && pass !== 'your_smtp_app_password') {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  // If no SMTP configured, return null for mock logger
  return null;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const fromEmail = process.env.EMAIL_FROM || process.env.SUPPORT_EMAIL || 'LOCAL2BRAND <hello@local2brand.com>';
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📧 [EMAIL SIMULATION] (Configure EMAIL_HOST/USER/PASS in .env for live sending)`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || 'HTML Content Generated'}\n`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text: text || '',
      html,
    });
    console.log(`✅ Email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ Email sending failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// 1. Welcome Email
export const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to LOCAL2BRAND, ${user.name}! 🚀`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #a855f7; margin: 0;">LOCAL<span style="color: #ec4899;">2</span>BRAND</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Build Local. Think Global.</p>
      </div>
      <div style="background: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #f8fafc; margin-top: 0;">Welcome aboard, ${user.name}! 👋</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">Thank you for creating an account on LOCAL2BRAND. Your portal is ready where you can track website proposals, project updates, and request callbacks anytime.</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background: linear-gradient(135deg, #9333ea, #db2777); color: white; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Go to My Dashboard</a>
        </div>
      </div>
      <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">© ${new Date().getFullYear()} LOCAL2BRAND. All rights reserved.</p>
    </div>
  `;
  return await sendEmail({ to: user.email, subject, html, text: `Welcome to LOCAL2BRAND, ${user.name}!` });
};

// 2. Project Inquiry / Lead Submitted Email (to Client)
export const sendLeadConfirmationEmail = async (lead) => {
  const subject = `Your Project Proposal Inquiry Received — LOCAL2BRAND (#${lead._id.toString().slice(-6)})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #a855f7; margin: 0;">LOCAL<span style="color: #ec4899;">2</span>BRAND</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Inquiry Confirmation</p>
      </div>
      <div style="background: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #38bdf8; margin-top: 0;">We've received your project requirements! 🎉</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">Hi <strong>${lead.name}</strong>, our engineering and design team has received your website requirements for <strong>${lead.businessName || lead.websiteType}</strong>.</p>
        
        <div style="background: #0f172a; padding: 16px; border-radius: 6px; margin: 16px 0; border: 1px solid #334155;">
          <p style="margin: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Website Type:</strong> ${lead.websiteType}</p>
          <p style="margin: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Industry:</strong> ${lead.industry}</p>
          <p style="margin: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Timeline:</strong> ${lead.timeline}</p>
          <p style="margin: 4px 0; color: #94a3b8; font-size: 13px;"><strong>Budget:</strong> ${lead.budget}</p>
          ${lead.estimatedPrice ? `<p style="margin: 4px 0; color: #4ade80; font-size: 14px; font-weight: bold;"><strong>Estimated Price:</strong> ${lead.estimatedPrice}</p>` : ''}
        </div>

        <p style="color: #cbd5e1; line-height: 1.6;">Our team will review your specs and reach out shortly. You can also track the status in your portal.</p>
      </div>
      <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">© ${new Date().getFullYear()} LOCAL2BRAND. Support: hello@local2brand.com</p>
    </div>
  `;
  return await sendEmail({ to: lead.email, subject, html, text: `Thank you for your inquiry, ${lead.name}!` });
};

// 3. Admin Notification on New Lead
export const sendAdminNewLeadAlert = async (lead) => {
  const adminEmail = process.env.SUPPORT_EMAIL || 'admin@local2brand.com';
  const subject = `🚨 [NEW LEAD] ${lead.name} submitted ${lead.websiteType} (${lead.budget})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e1e2e; color: #ffffff; padding: 24px; border-radius: 10px;">
      <h2 style="color: #f59e0b; margin-top: 0;">New Project Inquiry Received!</h2>
      <p>A new client has submitted a proposal request:</p>
      <ul>
        <li><strong>Client Name:</strong> ${lead.name}</li>
        <li><strong>Email:</strong> ${lead.email}</li>
        <li><strong>Phone:</strong> ${lead.phone}</li>
        <li><strong>Business:</strong> ${lead.businessName || 'N/A'}</li>
        <li><strong>Type:</strong> ${lead.websiteType}</li>
        <li><strong>Industry:</strong> ${lead.industry}</li>
        <li><strong>Budget:</strong> ${lead.budget}</li>
        <li><strong>Requirements:</strong> ${lead.requirements || 'None specified'}</li>
      </ul>
      <p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/leads" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Open Admin Panel</a></p>
    </div>
  `;
  return await sendEmail({ to: adminEmail, subject, html, text: `New lead from ${lead.name}: ${lead.phone}` });
};

// 4. Callback Scheduled Email (to Client and Admin)
export const sendCallbackConfirmationEmail = async (callback) => {
  if (!callback.email) return;
  const subject = `Callback Request Confirmed — LOCAL2BRAND`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
      <h2 style="color: #34d399; margin-top: 0;">Callback Scheduled! 📞</h2>
      <p style="color: #cbd5e1;">Hi <strong>${callback.name}</strong>, we have received your callback request. Our senior consultant will call you at <strong>${callback.phone}</strong> around <strong>${callback.preferredTime}</strong>.</p>
      <p style="color: #94a3b8; font-size: 13px;">Topic: ${callback.topic}</p>
    </div>
  `;
  return await sendEmail({ to: callback.email, subject, html, text: `Callback request received for ${callback.phone}` });
};

// 5. Lead Status Update Email
export const sendLeadStatusUpdateEmail = async (lead) => {
  const subject = `Update on your project proposal status: ${lead.status.toUpperCase()}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px;">
      <h2 style="color: #a855f7; margin-top: 0;">Project Proposal Status Update 📋</h2>
      <p style="color: #cbd5e1;">Hi <strong>${lead.name}</strong>, the status of your website inquiry (<strong>${lead.websiteType}</strong>) has been updated to:</p>
      <div style="background: #1e293b; padding: 14px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; color: #38bdf8; display: inline-block; margin: 12px 0;">
        Status: ${lead.status.toUpperCase().replace('_', ' ')}
      </div>
      ${lead.adminNotes ? `<p style="color: #94a3b8;"><strong>Note:</strong> ${lead.adminNotes}</p>` : ''}
    </div>
  `;
  return await sendEmail({ to: lead.email, subject, html, text: `Your proposal status is now ${lead.status}` });
};
