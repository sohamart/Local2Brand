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

// Universal Device-Adaptive (Light & Dark Theme Responsive) Agency Email Generator
const wrapAgencyEmail = ({ preheader, headerBadge, title, subtitle, contentHtml, ctaText, ctaUrl, footerNote }) => {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f6f8fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    a { text-decoration: none; }

    /* Dark Mode Auto-Adaptation for Mobile Devices & Inboxes */
    @media (prefers-color-scheme: dark) {
      body, .bg-body { background-color: #0b0f19 !important; }
      .bg-card { background-color: #111827 !important; border-color: #1f2937 !important; }
      .bg-header { background-color: #111827 !important; border-color: #1f2937 !important; }
      .bg-box { background-color: #162032 !important; border-color: #1f2937 !important; }
      .bg-footer { background-color: #0b0f19 !important; border-color: #1f2937 !important; }
      .text-title { color: #ffffff !important; }
      .text-body { color: #d1d5db !important; }
      .text-muted { color: #9ca3af !important; }
      .border-theme { border-color: #1f2937 !important; }
      .badge-theme { background-color: rgba(147, 51, 234, 0.2) !important; border-color: rgba(168, 85, 247, 0.4) !important; color: #c084fc !important; }
    }

    /* Android Gmail Dark Mode Support */
    [data-ogsc] .bg-body { background-color: #0b0f19 !important; }
    [data-ogsc] .bg-card { background-color: #111827 !important; border-color: #1f2937 !important; }
    [data-ogsc] .bg-box { background-color: #162032 !important; border-color: #1f2937 !important; }
    [data-ogsc] .text-title { color: #ffffff !important; }
    [data-ogsc] .text-body { color: #d1d5db !important; }
    [data-ogsc] .text-muted { color: #9ca3af !important; }
  </style>
</head>
<body class="bg-body" style="margin: 0; padding: 20px 8px; background-color: #f6f8fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: transparent;">${preheader}</div>` : ''}
  
  <!-- Outer Center Container -->
  <div style="width: 100%; max-width: 520px; margin: 0 auto; box-sizing: border-box;">
    
    <!-- Adaptive Rounded Main Agency Card -->
    <div class="bg-card border-theme" style="background-color: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); box-sizing: border-box; width: 100%;">
      
      <!-- Top Glowing Radiant Accent Bar -->
      <div style="height: 4px; width: 100%; background: linear-gradient(90deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%); line-height: 4px; font-size: 4px;">&nbsp;</div>

      <!-- Header Section -->
      <div class="bg-header border-theme" style="padding: 26px 20px 18px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; box-sizing: border-box;">
        <div class="badge-theme" style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #e9d5ff; color: #7e22ce; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
          ${headerBadge || '⚡ LOCAL2BRAND AGENCY'}
        </div>
        <h1 class="text-title" style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1.2;">
          LOCAL<span style="color: #ec4899;">2</span>BRAND
        </h1>
        <p class="text-muted" style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
          High-Performance Digital Agency &amp; Engineering
        </p>
      </div>

      <!-- Title / Intro Banner -->
      <div class="bg-card" style="padding: 20px 20px 8px 20px; background-color: #ffffff; box-sizing: border-box;">
        <h2 class="text-title" style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #0f172a; line-height: 1.35;">
          ${title}
        </h2>
        ${subtitle ? `<p class="text-muted" style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; font-weight: 500;">${subtitle}</p>` : ''}
      </div>

      <!-- Content Body -->
      <div class="bg-card text-body" style="padding: 6px 20px 24px 20px; font-size: 14px; line-height: 1.6; color: #334155; background-color: #ffffff; box-sizing: border-box;">
        ${contentHtml}

        <!-- Radiant Attractive CTA Button -->
        ${ctaText && ctaUrl ? `
          <div style="margin-top: 24px; margin-bottom: 8px; text-align: center;">
            <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%); background-color: #9333ea; color: #ffffff !important; padding: 14px 34px; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 900; display: inline-block; box-shadow: 0 8px 24px rgba(192, 38, 211, 0.45); letter-spacing: 0.4px;">
              ${ctaText} &rarr;
            </a>
          </div>
        ` : ''}
      </div>

      <!-- Footer Information -->
      <div class="bg-footer border-theme" style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; box-sizing: border-box;">
        <p class="text-muted" style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
          ${footerNote || 'This is an official automated dispatch from LOCAL2BRAND Platform &amp; AI Dispatch System.'}
        </p>
        <div style="font-size: 11px; color: #4b5563; margin-bottom: 8px;">
          <span>✉️ Official Contact: <a href="mailto:stackaddacontact@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">stackaddacontact@gmail.com</a></span>
          <span style="margin: 0 4px; color: #94a3b8;">•</span>
          <span>Admin: <a href="mailto:sohamduttabwn@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">sohamduttabwn@gmail.com</a></span>
        </div>
        <p class="text-muted" style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
          &copy; ${currentYear} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
};

// 1. Welcome Email
export const sendWelcomeEmail = async (user) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const subject = `Welcome to LOCAL2BRAND, ${user.name}! 🚀`;
  
  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${user.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Thank you for joining <strong>LOCAL2BRAND</strong>. Your client account has been successfully initialized. You can now access your dedicated project console, submit custom specifications, track launch roadmaps, and request instant founder callbacks.
      </p>
      <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; border: 1px solid #e2e8f0; margin-top: 14px; box-sizing: border-box;">
        <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Registered Email:</div>
        <div style="font-size: 14px; color: #7c3aed; font-weight: 800; font-family: monospace; word-break: break-all;">${user.email}</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Welcome to LOCAL2BRAND — Your dedicated agency portal is ready.`,
    headerBadge: '🚀 CLIENT PORTAL INITIALIZED',
    title: `Welcome aboard, ${user.name}! 👋`,
    subtitle: `Your client portal is ready for fast website launches & custom development.`,
    contentHtml,
    ctaText: 'Access My Client Dashboard',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `Welcome to LOCAL2BRAND, ${user.name}!` });
};

// 2. Project Inquiry / Lead Submitted Email (to Client)
export const sendLeadConfirmationEmail = async (lead) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const leadIdShort = (lead._id || '').toString().slice(-6).toUpperCase();
  const subject = `Proposal Received: ${lead.websiteType} (#${leadIdShort}) — LOCAL2BRAND`;
  
  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${lead.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        We have received your custom proposal inquiry for <strong>${lead.businessName || lead.websiteType}</strong>. Our senior architects are already reviewing your specifications.
      </p>

      <!-- Adaptive Spec Table -->
      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 14px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Project:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; width: 66%; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Domain:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.industry || 'Custom Business'}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Timeline:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #2563eb; font-size: 13px; vertical-align: top;">${lead.timeline || '48 Hours'}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Budget:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-size: 13px; vertical-align: top;">${lead.budget}</td>
        </tr>
        ${lead.estimatedPrice ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Est. Price:</td>
            <td style="padding: 11px 12px; font-weight: 900; color: #d97706; font-size: 13px; vertical-align: top;">${lead.estimatedPrice}</td>
          </tr>
        ` : ''}
      </table>

      <p class="text-muted" style="margin: 12px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        ⚡ <strong>Next Step:</strong> An engineer will reach out via WhatsApp / phone to confirm requirements and share your live staging preview.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `We have received your website inquiry for ${lead.websiteType}.`,
    headerBadge: '📋 PROPOSAL INTAKE CONFIRMATION',
    title: `Requirements Received! 🎉`,
    subtitle: `Reference: Inquiry #${leadIdShort}`,
    contentHtml,
    ctaText: 'Track Proposal in Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: lead.email, subject, html, text: `Thank you for your inquiry, ${lead.name}!` });
};

// 3. Admin Notification on New Lead
export const sendAdminNewLeadAlert = async (lead) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_ALERT_EMAIL || 'sohamduttabwn@gmail.com';
  const brandEmail = process.env.BRAND_EMAIL || process.env.SUPPORT_EMAIL || 'stackaddacontact@gmail.com';
  const recipients = Array.from(new Set([adminEmail, brandEmail, 'sohamduttabwn@gmail.com', 'stackaddacontact@gmail.com'])).filter(Boolean).join(', ');

  const subject = `🔥 [HOT LEAD] ${lead.name} submitted ${lead.websiteType} (${lead.budget})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        ⚡ NEW INCOMING PROJECT PROPOSAL
      </div>

      <!-- Adaptive Spec Table -->
      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Client Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; width: 66%; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.name}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px; vertical-align: top; word-break: break-all;">
            <a href="tel:${lead.phone}" style="color: #059669; text-decoration: none;">${lead.phone}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Email:</td>
          <td style="padding: 11px 12px; font-weight: 700; color: #2563eb; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Business:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.businessName || 'N/A'}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Type &amp; Domain:</td>
          <td class="text-body" style="padding: 11px 12px; color: #334155; font-weight: 600; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.websiteType} (${lead.industry})</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Budget / Time:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #d97706; font-size: 13px; vertical-align: top;">${lead.budget} • ${lead.timeline}</td>
        </tr>
        ${lead.requirements ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Specs / Notes:</td>
            <td class="text-muted" style="padding: 11px 12px; color: #475569; font-size: 12px; font-style: italic; vertical-align: top; word-break: break-word;">${lead.requirements}</td>
          </tr>
        ` : ''}
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New proposal from ${lead.name} (${lead.phone}) for ${lead.websiteType}.`,
    headerBadge: '🚨 ADMIN PRIORITY ALERT',
    title: `New Project Proposal Received! 🔥`,
    subtitle: `Client: ${lead.name} • ${lead.websiteType}`,
    contentHtml,
    ctaText: 'Open Leads Desk in Admin',
    ctaUrl: `${clientUrl}/admin/leads`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New lead from ${lead.name}: ${lead.phone}` });
};

// 4. Callback Scheduled Email (to Client)
export const sendCallbackConfirmationEmail = async (callback) => {
  if (!callback.email) return;
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const subject = `Founder Callback Confirmed — LOCAL2BRAND 📞`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${callback.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Your consultation callback has been scheduled with our senior engineering &amp; founding desk.
      </p>

      <!-- Adaptive Spec Table -->
      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box; margin: 14px 0;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px; width: 66%; vertical-align: top; word-break: break-all;">${callback.phone}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Slot:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #d97706; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.preferredTime}</td>
        </tr>
        <tr>
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Topic:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.topic}</td>
        </tr>
      </table>

      <p class="text-muted" style="margin: 12px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        💡 Please keep your phone reachable. Our senior consultant will call to discuss project scope and launch strategy.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your 15-min consultation callback is confirmed for ${callback.preferredTime}.`,
    headerBadge: '📞 FOUNDER CALLBACK QUEUE',
    title: `Callback Request Confirmed! 📞`,
    subtitle: `We'll call you at ${callback.phone} (${callback.preferredTime})`,
    contentHtml,
    ctaText: 'Visit LOCAL2BRAND Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: callback.email, subject, html, text: `Callback request received for ${callback.phone}` });
};

// 5. Admin & Brand Instant Alert on Callback Request
export const sendAdminCallbackAlert = async (callback) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_ALERT_EMAIL || 'sohamduttabwn@gmail.com';
  const brandEmail = process.env.BRAND_EMAIL || process.env.SUPPORT_EMAIL || 'stackaddacontact@gmail.com';
  const recipients = Array.from(new Set([adminEmail, brandEmail, 'sohamduttabwn@gmail.com', 'stackaddacontact@gmail.com'])).filter(Boolean).join(', ');

  const subject = `🚨 [INSTANT CALLBACK REQUEST] ${callback.name} — ${callback.phone}`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #fce7f3; border: 1px solid #fbcfe8; color: #be185d; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        ⚡ REAL-TIME CALLBACK DISPATCH
      </div>

      <!-- Adaptive Spec Table -->
      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Client Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; width: 66%; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.name}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone Number:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #059669; font-family: monospace; font-size: 14px; vertical-align: top; word-break: break-all;">
            <a href="tel:${callback.phone}" style="color: #059669; text-decoration: none;">${callback.phone}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Email Address:</td>
          <td style="padding: 11px 12px; color: #2563eb; font-weight: 600; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="mailto:${callback.email || ''}" style="color: #2563eb; text-decoration: none;">${callback.email || 'Not provided'}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Preferred Slot:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #d97706; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.preferredTime}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Topic / Scope:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.topic}</td>
        </tr>
        ${callback.notes ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Notes / Details:</td>
            <td class="text-muted" style="padding: 11px 12px; color: #475569; font-size: 12px; font-style: italic; vertical-align: top; word-break: break-word;">${callback.notes}</td>
          </tr>
        ` : ''}
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Instant callback request from ${callback.name} (${callback.phone}).`,
    headerBadge: '🚨 FOUNDER CALLBACK ALERT',
    title: `Instant Callback Request! 📞`,
    subtitle: `Client: ${callback.name} • ${callback.phone}`,
    contentHtml,
    ctaText: 'Open Callbacks Queue in Admin',
    ctaUrl: `${clientUrl}/admin/callbacks`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Instant callback request from ${callback.name} (${callback.phone}) for ${callback.topic}` });
};

// 6. Lead Status Update Email
export const sendLeadStatusUpdateEmail = async (lead) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const formattedStatus = (lead.status || 'Updated').toUpperCase().replace('_', ' ');
  const subject = `Status Update: ${formattedStatus} — ${lead.websiteType} (#${(lead._id || '').toString().slice(-6).toUpperCase()})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${lead.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        The progress status of your website project (<strong>${lead.websiteType}</strong>) has been updated:
      </p>

      <div class="bg-box border-theme" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; margin: 14px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Current Project Status</div>
        <div style="font-size: 18px; font-weight: 900; color: #15803d; letter-spacing: 0.5px;">${formattedStatus}</div>
      </div>

      ${lead.adminNotes ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-top: 14px; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Engineer Notes:</div>
          <div class="text-body" style="font-size: 13px; color: #334155; word-break: break-word;">${lead.adminNotes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your project proposal status is now ${formattedStatus}.`,
    headerBadge: '📋 PROJECT ROADMAP UPDATE',
    title: `Project Status Updated 📋`,
    subtitle: `New Status: ${formattedStatus}`,
    contentHtml,
    ctaText: 'View Project Progress',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: lead.email, subject, html, text: `Your proposal status is now ${lead.status}` });
};
