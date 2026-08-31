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

// Clean Universal Agency Email HTML Generator (Optimized for Mobile Light & Dark Modes)
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
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    body { margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; width: 100% !important; }
    table, td { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { border: 0; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 16px 8px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: transparent;">${preheader}</div>` : ''}
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto; width: 100%;">
    <tr>
      <td align="center" style="padding: 0;">
        
        <!-- Main Card Container (Max Width 580px for perfect mobile fit) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; border-top: 5px solid #9333ea; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          
          <!-- Header Section -->
          <tr>
            <td style="padding: 28px 24px 16px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #e9d5ff; color: #7e22ce; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
                      ${headerBadge || '⚡ LOCAL2BRAND AGENCY'}
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1.2;">
                      LOCAL<span style="color: #c026d3;">2</span>BRAND
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
                      High-Performance Digital Agency &amp; Engineering
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title / Intro Banner -->
          <tr>
            <td style="padding: 24px 24px 10px 24px; background-color: #ffffff;">
              <h2 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #0f172a; line-height: 1.35;">
                ${title}
              </h2>
              ${subtitle ? `<p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; font-weight: 500;">${subtitle}</p>` : ''}
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 6px 24px 24px 24px; font-size: 14px; line-height: 1.6; color: #334155; background-color: #ffffff;">
              ${contentHtml}

              <!-- Call To Action Button -->
              ${ctaText && ctaUrl ? `
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; margin-bottom: 6px;">
                  <tr>
                    <td align="center">
                      <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: #ffffff !important; padding: 13px 28px; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 800; display: inline-block; box-shadow: 0 6px 18px rgba(124, 58, 237, 0.3); letter-spacing: 0.3px;">
                        ${ctaText} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                      ${footerNote || 'This is an official automated dispatch from LOCAL2BRAND Platform &amp; AI Dispatch System.'}
                    </p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
                      <span>✉️ Official Contact: <a href="mailto:stackaddacontact@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">stackaddacontact@gmail.com</a></span>
                      <span style="margin: 0 4px; color: #cbd5e1;">•</span>
                      <span>Admin: <a href="mailto:sohamduttabwn@gmail.com" style="color: #7c3aed; text-decoration: none; font-weight: 600;">sohamduttabwn@gmail.com</a></span>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                      &copy; ${currentYear} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// 1. Welcome Email
export const sendWelcomeEmail = async (user) => {
  const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://local2brand.vercel.app';
  const subject = `Welcome to LOCAL2BRAND, ${user.name}! 🚀`;
  
  const contentHtml = `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <p style="margin: 0 0 14px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
        Hi <strong>${user.name}</strong>,
      </p>
      <p style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Thank you for joining <strong>LOCAL2BRAND</strong>. Your client account has been successfully initialized. You can now access your dedicated project console, submit custom specifications, track launch roadmaps, and request instant founder callbacks.
      </p>
      <div style="background-color: #ffffff; border-radius: 12px; padding: 14px 18px; border: 1px solid #e2e8f0; margin-top: 14px;">
        <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Registered Email:</div>
        <div style="font-size: 14px; color: #7c3aed; font-weight: 800; font-family: monospace;">${user.email}</div>
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
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <p style="margin: 0 0 14px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
        Hi <strong>${lead.name}</strong>,
      </p>
      <p style="margin: 0 0 16px 0; color: #334155; line-height: 1.6;">
        We have received your custom proposal inquiry for <strong>${lead.businessName || lead.websiteType}</strong>. Our senior architects are already reviewing your specifications.
      </p>

      <!-- Project Spec Summary Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 14px; color: #64748b; width: 35%; font-weight: 600;">Project Type:</td>
          <td style="padding: 10px 14px; font-weight: 800; color: #0f172a;">${lead.websiteType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Industry Domain:</td>
          <td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${lead.industry || 'Custom Business'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Timeline Target:</td>
          <td style="padding: 10px 14px; font-weight: 800; color: #2563eb;">${lead.timeline || '48 Hours'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Selected Budget:</td>
          <td style="padding: 10px 14px; font-weight: 800; color: #059669;">${lead.budget}</td>
        </tr>
        ${lead.estimatedPrice ? `
          <tr>
            <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Estimated Price:</td>
            <td style="padding: 10px 14px; font-weight: 900; color: #d97706; font-size: 14px;">${lead.estimatedPrice}</td>
          </tr>
        ` : ''}
      </table>

      <p style="margin: 14px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">
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
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        ⚡ NEW INCOMING PROJECT PROPOSAL
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; width: 35%; font-weight: 600;">Client Name:</td><td style="padding: 10px 14px; font-weight: 800; color: #0f172a;">${lead.name}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Phone:</td><td style="padding: 10px 14px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px;"><a href="tel:${lead.phone}" style="color: #059669; text-decoration: none;">${lead.phone}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Email:</td><td style="padding: 10px 14px; font-weight: 700; color: #2563eb;"><a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Business Name:</td><td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${lead.businessName || 'N/A'}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Type &amp; Industry:</td><td style="padding: 10px 14px; color: #334155; font-weight: 600;">${lead.websiteType} (${lead.industry})</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Budget &amp; Timeline:</td><td style="padding: 10px 14px; font-weight: 800; color: #d97706;">${lead.budget} • ${lead.timeline}</td></tr>
        ${lead.requirements ? `<tr><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Specs / Notes:</td><td style="padding: 10px 14px; color: #334155; font-style: italic;">${lead.requirements}</td></tr>` : ''}
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
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <p style="margin: 0 0 14px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
        Hi <strong>${callback.name}</strong>,
      </p>
      <p style="margin: 0 0 16px 0; color: #334155; line-height: 1.6;">
        Your consultation callback has been scheduled with our senior engineering &amp; founding desk.
      </p>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; width: 35%; font-weight: 600;">Contact Number:</td><td style="padding: 10px 14px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px;">${callback.phone}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Preferred Slot:</td><td style="padding: 10px 14px; font-weight: 800; color: #d97706;">${callback.preferredTime}</td></tr>
        <tr><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Consultation Topic:</td><td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${callback.topic}</td></tr>
      </table>

      <p style="margin: 16px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">
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
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <div style="display: inline-block; background-color: #fce7f3; border: 1px solid #fbcfe8; color: #be185d; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        ⚡ REAL-TIME CALLBACK DISPATCH
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; width: 35%; font-weight: 600;">Client Name:</td><td style="padding: 10px 14px; font-weight: 800; color: #0f172a;">${callback.name}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Phone Number:</td><td style="padding: 10px 14px; font-weight: 900; color: #059669; font-family: monospace; font-size: 16px;"><a href="tel:${callback.phone}" style="color: #059669; text-decoration: none;">${callback.phone}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Email Address:</td><td style="padding: 10px 14px; color: #2563eb; font-weight: 600;"><a href="mailto:${callback.email || ''}" style="color: #2563eb; text-decoration: none;">${callback.email || 'Not provided'}</a></td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Preferred Slot:</td><td style="padding: 10px 14px; font-weight: 800; color: #d97706;">${callback.preferredTime}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Topic / Inquiry:</td><td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${callback.topic}</td></tr>
        ${callback.notes ? `<tr><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Notes / Details:</td><td style="padding: 10px 14px; color: #334155; font-style: italic;">${callback.notes}</td></tr>` : ''}
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
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin: 16px 0;">
      <p style="margin: 0 0 14px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
        Hi <strong>${lead.name}</strong>,
      </p>
      <p style="margin: 0 0 16px 0; color: #334155; line-height: 1.6;">
        The progress status of your website project (<strong>${lead.websiteType}</strong>) has been updated:
      </p>

      <div style="background-color: #ffffff; border: 1px solid #38bdf8; border-radius: 12px; padding: 16px 20px; margin: 16px 0; text-align: center;">
        <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Current Project Status</div>
        <div style="font-size: 18px; font-weight: 900; color: #0284c7; letter-spacing: 0.5px;">${formattedStatus}</div>
      </div>

      ${lead.adminNotes ? `
        <div style="background-color: #ffffff; border-radius: 12px; padding: 14px 18px; border: 1px solid #e2e8f0; margin-top: 14px;">
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Engineer Notes:</div>
          <div style="font-size: 13px; color: #0f172a;">${lead.adminNotes}</div>
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
