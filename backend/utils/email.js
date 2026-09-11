import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dataStore } from '../config/dataAdapter.js';

dotenv.config();

// Universal Base URL Resolver (Always respects CLIENT_URL / FRONTEND_URL from .env with fallback to local2brand.vercel.app)
export const getClientUrl = (path = '') => {
  let base = '';
  
  if (process.env.FRONTEND_URL) {
    base = process.env.FRONTEND_URL.trim().replace(/\/$/, '');
  } else if (process.env.CLIENT_URL) {
    const rawUrls = process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, '')).filter(Boolean);
    if (rawUrls.length > 0) {
      const publicUrl = rawUrls.find((u) => !u.includes('localhost') && !u.includes('127.0.0.1'));
      base = publicUrl || rawUrls[0];
    }
  }

  if (!base || base.includes('local2brandofficial') || base.includes('local2brandofficial.vercel.app') || base.includes('local2brandofficial.com')) {
    base = 'https://local2brand.cyou';
  }

  if (!path) return base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// Cached singleton transporter with auto-reconfiguration detection
let cachedTransporter = null;
let lastTransporterConfigKey = '';

let cachedFallbackTransporter = null;
let lastFallbackConfigKey = '';

const createTransporter = () => {
  const host = (process.env.EMAIL_HOST || 'smtp-relay.brevo.com').trim();
  const port = process.env.EMAIL_PORT || '587';
  const user = (process.env.EMAIL_USER || 'b7fa99001@smtp-brevo.com').trim();
  const pass = (process.env.EMAIL_PASS || process.env.BREVO_API_KEY || '').trim();

  const currentKey = `${host}:${port}:${user}:${pass}`;

  if (cachedTransporter && lastTransporterConfigKey === currentKey) {
    return cachedTransporter;
  }

  if (user && pass && pass !== 'your_smtp_app_password') {
    if (host === 'smtp.gmail.com' || (!host && user.includes('@gmail.com'))) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    } else if (host) {
      cachedTransporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }
    lastTransporterConfigKey = currentKey;
    return cachedTransporter;
  }

  return null;
};

const createFallbackTransporter = () => {
  const host = (process.env.FALLBACK_EMAIL_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : '')).trim();
  const port = process.env.FALLBACK_EMAIL_PORT || 587;
  const user = (process.env.FALLBACK_EMAIL_USER || process.env.GMAIL_USER || '').trim();
  const pass = (process.env.FALLBACK_EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '').trim();

  const currentKey = `${host}:${port}:${user}:${pass}`;
  if (cachedFallbackTransporter && lastFallbackConfigKey === currentKey) {
    return cachedFallbackTransporter;
  }

  if (user && pass && pass !== 'your_smtp_app_password') {
    if (host === 'smtp.gmail.com' || (!host && user.includes('@gmail.com'))) {
      cachedFallbackTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    } else if (host) {
      cachedFallbackTransporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });
    }
    lastFallbackConfigKey = currentKey;
    return cachedFallbackTransporter;
  }

  return null;
};

// Helper to format status strings to clean title case (avoids ALL_CAPS spam filters)
export const formatStatusTitle = (status = '') => {
  if (!status) return 'Updated';
  return String(status)
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

// Central helper to resolve active admin email recipients for system alerts
export const getAdminRecipients = () => {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  const adminAlertEmail = (process.env.ADMIN_ALERT_EMAIL || '').trim();
  const brandEmail = (process.env.BRAND_EMAIL || '').trim();
  const supportEmail = (process.env.SUPPORT_EMAIL || '').trim();

  const rawList = [
    adminEmail,
    adminAlertEmail,
    brandEmail,
    supportEmail,
    'sohamduttabwn@gmail.com',
    'local2brand@zohomail.in'
  ];

  const validSet = new Set();
  for (const item of rawList) {
    if (item && typeof item === 'string') {
      const clean = item.trim().toLowerCase();
      if (
        clean.includes('@') &&
        !clean.includes('@local2brand.com') &&
        !clean.includes('local2brand.contact@gmail.com')
      ) {
        validSet.add(clean);
      }
    }
  }

  if (validSet.size === 0) {
    validSet.add('sohamduttabwn@gmail.com');
  }

  return Array.from(validSet);
};

// Brevo Direct Transactional API Sender (Ultra-fast HTTPS, zero ISP port blocks, 100% Inbox delivery)
export const sendViaBrevoApi = async ({ to, subject, html, text }) => {
  const apiKey = (
    process.env.BREVO_API_KEY ||
    (process.env.EMAIL_PASS && process.env.EMAIL_PASS.startsWith('xkeysib-') ? process.env.EMAIL_PASS : '')
  ).trim();

  if (!apiKey) return null;

  let senderEmail = 'support@local2brand.cyou';
  if (process.env.EMAIL_FROM && process.env.EMAIL_FROM.includes('<')) {
    const match = process.env.EMAIL_FROM.match(/<([^>]+)>/);
    if (match && match[1]) senderEmail = match[1].trim();
  }

  const senderName = process.env.BRAND_NAME || 'LOCAL2BRAND';
  const supportEmail = process.env.SUPPORT_EMAIL || 'local2brand@zohomail.in';
  const clientUrl = getClientUrl();

  const rawList = Array.isArray(to) ? to : (typeof to === 'string' ? to.split(',') : [to]);
  const recipients = rawList
    .map((item) => {
      if (typeof item === 'string') return { email: item.trim() };
      if (item && item.email) return { email: String(item.email).trim(), name: item.name };
      return null;
    })
    .filter((r) => r && r.email && r.email.includes('@') && !r.email.includes('@local2brand.com'));

  if (recipients.length === 0) return null;

  try {
    const payload = {
      sender: { name: senderName, email: senderEmail },
      replyTo: { name: `${senderName} Support`, email: supportEmail },
      to: recipients,
      subject,
      htmlContent: html,
      textContent: text,
      headers: {
        'X-Priority': '1',
        'Importance': 'high',
        'Priority': 'urgent',
        'X-MSMail-Priority': 'High',
        'X-Message-Delivery': 'direct',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'Feedback-ID': `L2B-TRANSACTIONAL:${senderEmail}:LOCAL2BRAND`,
        'List-Unsubscribe': `<mailto:${supportEmail}?subject=Unsubscribe>, <${clientUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Mailer': 'LOCAL2BRAND Transactional Mailer v2.0',
      },
      tags: ['transactional', 'important-notification', 'order-update'],
    };

    let response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 429) {
      console.warn('⚠️ Brevo API rate limit hit (429). Backing off for 2.5s before retry...');
      await new Promise((resolve) => setTimeout(resolve, 2500));
      response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();
    if (response.ok && data.messageId) {
      console.log(`✅ Email sent successfully via Brevo API to ${recipients.map(r => r.email).join(', ')} (MessageId: ${data.messageId})`);
      return { success: true, messageId: data.messageId };
    } else {
      console.warn(`⚠️ Brevo API error details:`, data);
      return null;
    }
  } catch (err) {
    console.warn(`⚠️ Brevo API connection error:`, err.message);
    return null;
  }
};

export const sendEmail = async ({ to, subject, html, text, priority = 'high', isImportant = true }) => {
  const fromEmail = process.env.EMAIL_FROM || `"LOCAL2BRAND" <support@local2brand.cyou>`;
  const supportEmail = process.env.SUPPORT_EMAIL || 'local2brand@zohomail.in';

  // Clean HTML to Plaintext converter
  const cleanPlainText = text || (html
    ? html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<tr[^>]*>/gi, '\n')
        .replace(/<td[^>]*>/gi, '  ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&rarr;/g, '->')
        .replace(/&amp;/g, '&')
        .replace(/&copy;/g, '©')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim()
    : '');

  // 1. First priority: Direct Brevo API
  const brevoResult = await sendViaBrevoApi({ to, subject, html, text: cleanPlainText });
  if (brevoResult && brevoResult.success) {
    return brevoResult;
  }

  // 2. Second priority: Standard SMTP Transporter
  let transporter = createTransporter();

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL SIMULATION] (Configure BREVO_API_KEY in .env for live sending)`);
    console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${cleanPlainText || 'HTML Content'}`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }

  const appClientUrl = getClientUrl();
  const emailHeaders = {
    'X-Priority': '1',
    'Importance': 'high',
    'Priority': 'urgent',
    'X-MSMail-Priority': 'High',
    'X-Message-Delivery': 'direct',
    'X-Entity-Ref-ID': `L2B-${Date.now()}`,
    'X-Auto-Response-Suppress': 'OOF, AutoReply',
    'Feedback-ID': `L2B-TRANSACTIONAL:LOCAL2BRAND`,
    'List-Unsubscribe': `<mailto:${supportEmail}?subject=Unsubscribe>, <${appClientUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };

  try {
    const rawTo = Array.isArray(to) ? to.join(', ') : to;
    const info = await transporter.sendMail({
      from: fromEmail,
      replyTo: `"LOCAL2BRAND Support" <${supportEmail}>`,
      to: rawTo,
      subject,
      text: cleanPlainText,
      html,
      headers: emailHeaders,
      priority: 'high',
    });
    console.log(`✅ Email sent successfully via SMTP to ${rawTo} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ Primary SMTP email sending failed to ${to}:`, error.message);

    const fallbackTransporter = createFallbackTransporter();
    if (fallbackTransporter) {
      try {
        const fallbackFrom = `"LOCAL2BRAND" <${process.env.FALLBACK_EMAIL_USER || 'local2brand@zohomail.in'}>`;
        const fbInfo = await fallbackTransporter.sendMail({
          from: fallbackFrom,
          replyTo: `"LOCAL2BRAND Support" <${supportEmail}>`,
          to: Array.isArray(to) ? to.join(', ') : to,
          subject,
          text: cleanPlainText,
          html,
          headers: emailHeaders,
          priority: 'high',
        });
        console.log(`✅ Email sent successfully via FALLBACK SMTP to ${to} (MessageId: ${fbInfo.messageId})`);
        return { success: true, messageId: fbInfo.messageId };
      } catch (fbErr) {
        console.error(`❌ Fallback SMTP sending also failed:`, fbErr.message);
      }
    }

    return { success: false, error: error.message };
  }
};

// Universal Device-Adaptive (Light & Dark Theme Responsive) Agency Email Generator
export const wrapAgencyEmail = ({ preheader, headerBadge, title, subtitle, contentHtml, ctaText, ctaUrl, footerNote, orderId }) => {
  const currentYear = new Date().getFullYear();
  const clientUrl = getClientUrl();
  const supportEmail = process.env.SUPPORT_EMAIL || 'local2brand@zohomail.in';
  const logoImgUrl = clientUrl && !clientUrl.includes('localhost') && !clientUrl.includes('127.0.0.1')
    ? `${clientUrl}/logo.jpg`
    : 'https://local2brand.cyou/logo.jpg';

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
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    a { text-decoration: none; }

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
      .id-badge { background-color: #1e1b4b !important; border-color: #4338ca !important; color: #a5b4fc !important; }
    }

    [data-ogsc] .bg-body { background-color: #0b0f19 !important; }
    [data-ogsc] .bg-card { background-color: #111827 !important; border-color: #1f2937 !important; }
    [data-ogsc] .bg-box { background-color: #162032 !important; border-color: #1f2937 !important; }
    [data-ogsc] .text-title { color: #ffffff !important; }
    [data-ogsc] .text-body { color: #d1d5db !important; }
    [data-ogsc] .text-muted { color: #9ca3af !important; }
  </style>
</head>
<body class="bg-body" style="margin: 0; padding: 24px 8px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #f8fafc; opacity: 0;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  ` : ''}
  
  <div style="width: 100%; max-width: 540px; margin: 0 auto; box-sizing: border-box;">
    <div class="bg-card border-theme" style="background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); box-sizing: border-box; width: 100%;">
      <div style="height: 5px; width: 100%; background: linear-gradient(90deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%); line-height: 5px; font-size: 5px;">&nbsp;</div>

      <div class="bg-header border-theme" style="padding: 24px 24px 18px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto; text-align: center;">
          <tr>
            <td align="center" style="vertical-align: middle;">
              <a href="${clientUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoImgUrl}" alt="LOCAL2BRAND" width="56" height="56" style="width: 56px; height: 56px; border-radius: 14px; display: block; margin: 0 auto; object-fit: cover; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.2);" />
              </a>
            </td>
          </tr>
        </table>

        <div class="badge-theme" style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background-color: #f3e8ff; border: 1px solid #e9d5ff; color: #7e22ce; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
          ${headerBadge || 'IMPORTANT DISPATCH'}
        </div>
        <h1 class="text-title" style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; line-height: 1.2;">
          LOCAL<span style="color: #c026d3;">2</span>BRAND
        </h1>
        <p class="text-muted" style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
          Official Client Dispatch &bull; Fast-Track Web Development
        </p>

        ${orderId ? `
          <div style="margin-top: 14px;">
            <div class="id-badge" style="display: inline-block; padding: 6px 16px; border-radius: 12px; background-color: #eef2ff; border: 1.5px dashed #6366f1; color: #4338ca; font-size: 14px; font-weight: 900; font-family: monospace; letter-spacing: 1.5px;">
              ORDER ID: ${orderId}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="bg-card" style="padding: 20px 24px 8px 24px; background-color: #ffffff; box-sizing: border-box;">
        <h2 class="text-title" style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.35;">
          ${title}
        </h2>
        ${subtitle ? `<p class="text-muted" style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; font-weight: 500;">${subtitle}</p>` : ''}
      </div>

      <div class="bg-card text-body" style="padding: 6px 24px 28px 24px; font-size: 14px; line-height: 1.6; color: #334155; background-color: #ffffff; box-sizing: border-box;">
        ${contentHtml}

        ${ctaText && ctaUrl ? `
          <div style="margin-top: 26px; margin-bottom: 8px; text-align: center;">
            <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #f43f5e 100%); background-color: #9333ea; color: #ffffff !important; padding: 14px 34px; text-decoration: none; border-radius: 14px; font-size: 14px; font-weight: 900; display: inline-block; box-shadow: 0 8px 24px rgba(192, 38, 211, 0.4); letter-spacing: 0.4px;">
              ${ctaText} &rarr;
            </a>
          </div>
        ` : ''}
      </div>

      <div class="bg-footer border-theme" style="padding: 22px 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; box-sizing: border-box;">
        <p class="text-muted" style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
          ${footerNote || 'This is an important verified notification regarding your LOCAL2BRAND client account & project development.'}
        </p>
        <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.6;">
          <span>📍 <strong>LOCAL2BRAND Technologies Pvt. Ltd.</strong> &bull; Rathtala, Burdwan, West Bengal - 713102, India</span><br />
          <span>✉️ Direct Support: <a href="mailto:${supportEmail}" style="color: #7c3aed; text-decoration: none; font-weight: 700;">${supportEmail}</a> &bull; 🌐 <a href="${clientUrl}" style="color: #7c3aed; text-decoration: none; font-weight: 700;">local2brand.cyou</a></span>
        </div>
        <p class="text-muted" style="margin: 0; font-size: 10px; color: #94a3b8; font-weight: 500;">
          &copy; ${currentYear} LOCAL2BRAND Technologies Pvt. Ltd. All rights reserved. &bull; <a href="${clientUrl}/dashboard?tab=profile" style="color: #94a3b8; text-decoration: underline;">Manage Notification Settings</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// Universal Helper to Resolve Actual Client Email across diverse schemas and drafts
export const resolveClientEmail = (doc) => {
  if (!doc) return '';
  const candidates = [
    doc.clientInfo?.email,
    doc.email,
    doc.emailAddress,
    doc.answers?.emailAddress,
    doc.answers?.email,
    doc.fullFormData?.emailAddress,
    doc.fullFormData?.email,
    doc.user?.email,
  ];

  for (const c of candidates) {
    if (c && typeof c === 'string') {
      const clean = c.trim().toLowerCase();
      if (
        clean.includes('@') &&
        !clean.includes('customer@local2brand.com') &&
        !clean.includes('customer@local2brand.cyou') &&
        !clean.includes('@client.local2brand.com')
      ) {
        return clean;
      }
    }
  }

  // If user ID is attached, check local store / db for registered user email
  if (doc.user || doc.userId) {
    try {
      const uId = (doc.userId || doc.user?._id || doc.user)?.toString();
      if (uId) {
        const found = dataStore.findById('users', uId);
        if (found?.email && found.email.includes('@')) {
          return found.email.trim().toLowerCase();
        }
      }
    } catch (e) {}
  }

  const raw = doc.clientInfo?.email || doc.email || doc.emailAddress || '';
  const cleanRaw = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (
    cleanRaw.includes('@') &&
    !cleanRaw.includes('customer@local2brand.com') &&
    !cleanRaw.includes('customer@local2brand.cyou')
  ) {
    return cleanRaw;
  }
  return '';
};

// 1. Welcome Email
export const sendWelcomeEmail = async (user) => {
  const clientUrl = getClientUrl();
  const subject = `Welcome to LOCAL2BRAND, ${user.name}!`;
  
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
    headerBadge: 'CLIENT PORTAL INITIALIZED',
    title: `Welcome aboard, ${user.name}!`,
    subtitle: `Your client portal is ready for fast website launches & custom development.`,
    contentHtml,
    ctaText: 'Access My Client Dashboard',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `Welcome to LOCAL2BRAND, ${user.name}!` });
};

// 2. Requirement / Order Submitted Email (to Client)
export const sendRequirementConfirmationEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || reqDoc.businessName || 'Your Business';
  const websiteType = reqDoc.websiteTypeName || reqDoc.websiteType || 'Custom Website';
  const clientEmail = resolveClientEmail(reqDoc);

  if (!clientEmail) {
    console.warn(`sendRequirementConfirmationEmail notice: No client email found for ${reqId}`);
    return { success: false, error: 'No client email provided' };
  }

  const subject = `Order Confirmed: ${businessName} (#${reqId}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        We have received your complete website specifications for <strong>${businessName}</strong>. Our senior engineers &amp; UI designers have queued your project for architecture review.
      </p>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 16px 0; background-color: #f8fafc; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 36%; font-size: 12px; font-weight: 600; vertical-align: top;">Order / Req ID:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #4338ca; font-family: monospace; font-size: 14px; width: 64%; vertical-align: top;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Business Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${businessName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Category:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Delivery Speed:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #2563eb; font-size: 13px; vertical-align: top;">${reqDoc.timeline || 'Express (48 - 72 Hours)'}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Investment Tier:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-size: 13px; vertical-align: top;">${reqDoc.budget || 'Standard Commercial'}</td>
        </tr>
        <tr>
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Current Status:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #7c3aed; font-size: 13px; vertical-align: top;">Submitted &bull; Under Engineering Review</td>
        </tr>
      </table>

      <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 12px 16px; margin: 14px 0;">
        <p style="margin: 0; font-size: 12px; color: #3730a3; font-weight: 600; line-height: 1.5;">
          📍 <strong>Live Order Tracking:</strong> You can track live sprint milestones, review quotes, and communicate with founders using your Order ID <strong>${reqId}</strong> in your client portal.
        </p>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Order ${reqId} confirmed for ${businessName}. Tracking is now active.`,
    headerBadge: 'WEBSITE ORDER INITIALIZED',
    title: `Website Order Confirmed`,
    subtitle: `We have logged your specifications and started architecture planning.`,
    orderId: reqId,
    contentHtml,
    ctaText: `Track Order ${reqId} Online`,
    ctaUrl: `${clientUrl}/track-order?id=${reqId}`,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Requirements confirmed for ${businessName} (${reqId})` });
};

// 3. Admin Notification on New Requirement Submission
export const sendAdminRequirementAlert = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const recipients = getAdminRecipients();

  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || 'New Business';
  const websiteType = reqDoc.websiteTypeName || reqDoc.websiteType || 'Custom Website';
  const phone = reqDoc.clientInfo?.mobile || 'N/A';
  const email = resolveClientEmail(reqDoc) || reqDoc.clientInfo?.email || 'N/A';

  const subject = `New Website Order: ${businessName} (#${reqId})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        NEW CLIENT SPECIFICATION &amp; ORDER SUBMISSION
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Requirement ID:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #4338ca; font-family: monospace; font-size: 14px; width: 66%; vertical-align: top;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Client Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${clientName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px; vertical-align: top; word-break: break-all;">
            <a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Email:</td>
          <td style="padding: 11px 12px; font-weight: 700; color: #2563eb; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Business Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${businessName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Industry &amp; Type:</td>
          <td class="text-body" style="padding: 11px 12px; color: #334155; font-weight: 600; font-size: 13px; vertical-align: top; word-break: break-word;">${websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Budget &amp; Speed:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #d97706; font-size: 13px; vertical-align: top;">${reqDoc.budget || 'Standard'} &bull; ${reqDoc.timeline || 'Express'}</td>
        </tr>
        ${reqDoc.additionalNotes ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Notes:</td>
            <td class="text-muted" style="padding: 11px 12px; color: #475569; font-size: 12px; font-style: italic; vertical-align: top; word-break: break-word;">${reqDoc.additionalNotes}</td>
          </tr>
        ` : ''}
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New order ${reqId} received from ${clientName} (${phone}) for ${businessName}.`,
    headerBadge: 'ADMIN ORDER DISPATCH',
    title: `New Website Order Received`,
    subtitle: `Order: ${reqId} &bull; ${businessName}`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Open Requirements in Admin Panel',
    ctaUrl: `${clientUrl}/admin/requirements`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New website order ${reqId} from ${clientName} (${phone})`, isImportant: true, priority: 'high' });
};

// 4. Requirement Status & Quote Update Email (to Client)
export const sendRequirementStatusUpdateEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const clientEmail = resolveClientEmail(reqDoc);
  const status = reqDoc.status || 'Updated';
  const formattedStatus = formatStatusTitle(status);
  const pdfUrl = reqDoc.drivePdfLink || reqDoc.pdfUrl || reqDoc.documentUrl || reqDoc.attachmentUrl;

  if (!clientEmail) {
    console.warn(`sendRequirementStatusUpdateEmail notice: No client email found for ${reqId}`);
    return { success: false, error: 'No client email provided' };
  }

  const subject = `Order Status Update: ${formattedStatus} - ${reqDoc.clientInfo?.businessName || 'Your Website'} (#${reqId})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        The development progress &amp; milestone roadmap for your website order (<strong>${reqId}</strong>) has been updated:
      </p>

      <div class="bg-box border-theme" style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 18px 22px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">Current Milestone Status</div>
        <div style="font-size: 20px; font-weight: 900; color: #15803d; letter-spacing: 0.5px;">${formattedStatus}</div>
      </div>

      ${reqDoc.quotedAmount ? `
        <div class="bg-box border-theme" style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 14px 18px; margin: 14px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; color: #854d0e; text-transform: uppercase; font-weight: 800; margin-bottom: 2px;">Official Quoted Investment</div>
          <div style="font-size: 18px; font-weight: 900; color: #a16207;">${reqDoc.quotedAmount}</div>
        </div>
      ` : ''}

      ${pdfUrl ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #6366f1; border-radius: 14px; padding: 16px; margin: 16px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            📄 Official Project PDF Document / Proposal Attached
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">
            Our engineering team has attached the official project document / quotation PDF for your review:
          </p>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 10px 22px; font-size: 13px; font-weight: 800; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
            Open / Download PDF Document
          </a>
          <div style="font-size: 11px; color: #64748b; margin-top: 8px; word-break: break-all;">
            Direct Link: <a href="${pdfUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline;">${pdfUrl}</a>
          </div>
        </div>
      ` : ''}

      ${reqDoc.internalNotes ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-top: 14px; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Engineer Notes:</div>
          <div class="text-body" style="font-size: 13px; color: #334155; word-break: break-word;">${reqDoc.internalNotes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your website order ${reqId} is now ${formattedStatus}. Track milestones live.`,
    headerBadge: 'PROJECT ROADMAP UPDATE',
    title: `Order Status: ${formattedStatus}`,
    subtitle: `Current Phase: ${formattedStatus} &bull; Order ID: ${reqId}`,
    orderId: reqId,
    contentHtml,
    ctaText: `Track Order ${reqId} Live`,
    ctaUrl: `${clientUrl}/track-order?id=${reqId}`,
  });

  return await sendEmail({
    to: clientEmail,
    subject,
    html,
    text: `Your order ${reqId} status is now ${formattedStatus}`,
    isImportant: true,
    priority: 'high',
  });
};

// 5. Project Inquiry / Lead Submitted Email (to Client)
export const sendLeadConfirmationEmail = async (lead) => {
  const clientUrl = getClientUrl();
  const leadIdShort = (lead._id || '').toString().slice(-6).toUpperCase();
  const subject = `Proposal Inquiry Received: ${lead.websiteType || 'Custom Project'} (#${leadIdShort}) - LOCAL2BRAND`;
  
  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${lead.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        We have received your custom proposal inquiry for <strong>${lead.businessName || lead.websiteType}</strong>. Our senior architects are already reviewing your specifications.
      </p>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 14px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Inquiry Ref:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #4338ca; font-family: monospace; font-size: 13px; width: 66%; vertical-align: top;">#${leadIdShort}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Project:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Timeline:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #2563eb; font-size: 13px; vertical-align: top;">${lead.timeline || '48 Hours'}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Budget:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-size: 13px; vertical-align: top;">${lead.budget}</td>
        </tr>
      </table>

      <p class="text-muted" style="margin: 12px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        ⚡ <strong>Next Step:</strong> An engineer will reach out via WhatsApp / phone to confirm requirements and share your live staging preview.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `We have received your website inquiry for ${lead.websiteType}.`,
    headerBadge: 'PROPOSAL INTAKE CONFIRMATION',
    title: `Inquiry Received`,
    subtitle: `Reference: #${leadIdShort}`,
    orderId: `#${leadIdShort}`,
    contentHtml,
    ctaText: 'Track Proposal in Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: lead.email, subject, html, text: `Thank you for your inquiry, ${lead.name}!` });
};

// 6. Admin Notification on New Lead or Contact Form Message
export const sendAdminNewLeadAlert = async (lead) => {
  const clientUrl = getClientUrl();
  const recipients = getAdminRecipients();

  const isContactForm = lead.industry === 'Direct Contact Form' || lead.websiteType?.includes('Contact Form') || lead.budget === 'Custom Quotation';
  const subject = isContactForm
    ? `New Contact Message: ${lead.name} (${lead.phone}) - LOCAL2BRAND`
    : `New Project Inquiry: ${lead.name} - ${lead.websiteType} (${lead.budget})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        ${isContactForm ? 'NEW CONTACT MESSAGE / INQUIRY' : 'NEW INCOMING PROJECT PROPOSAL'}
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Sender / Client:</td>
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
        ${lead.businessName ? `
          <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Business:</td>
            <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.businessName}</td>
          </tr>
        ` : ''}
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Category:</td>
          <td class="text-body" style="padding: 11px 12px; color: #334155; font-weight: 600; font-size: 13px; vertical-align: top; word-break: break-word;">${lead.websiteType}</td>
        </tr>
        ${lead.requirements ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Message / Requirements:</td>
            <td class="text-muted" style="padding: 11px 12px; color: #475569; font-size: 12px; font-style: italic; vertical-align: top; word-break: break-word;">${lead.requirements}</td>
          </tr>
        ` : ''}
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New contact message from ${lead.name} (${lead.phone}).`,
    headerBadge: isContactForm ? 'ADMIN CONTACT ALERT' : 'ADMIN INCOMING LEAD',
    title: isContactForm ? `New Contact Message: ${lead.name}` : `New Project Proposal: ${lead.websiteType}`,
    subtitle: `Client: ${lead.name} &bull; ${lead.phone}`,
    contentHtml,
    ctaText: 'Open Leads Desk in Admin',
    ctaUrl: `${clientUrl}/admin/leads`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New inquiry from ${lead.name}: ${lead.phone}`, isImportant: true, priority: 'high' });
};

// 6a. Contact Form Confirmation Email (to Client)
export const sendContactFormConfirmationEmail = async (contactDoc) => {
  if (!contactDoc.email) return;
  const clientUrl = getClientUrl();
  const contactName = contactDoc.name || 'Valued Client';
  const subject = `We Received Your Message - LOCAL2BRAND Client Desk`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${contactName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Thank you for contacting <strong>LOCAL2BRAND</strong>. We have received your inquiry / consultation note. Our engineering &amp; client relations team is reviewing your message.
      </p>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 14px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${contactDoc.name}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #059669; font-family: monospace; font-size: 14px; vertical-align: top;">${contactDoc.phone}</td>
        </tr>
        ${contactDoc.businessName ? `
          <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Business / Brand:</td>
            <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top;">${contactDoc.businessName}</td>
          </tr>
        ` : ''}
        ${contactDoc.requirements ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Message:</td>
            <td class="text-body" style="padding: 11px 12px; color: #334155; font-size: 13px; vertical-align: top; word-break: break-word;">${contactDoc.requirements}</td>
          </tr>
        ` : ''}
      </table>

      <p class="text-muted" style="margin: 12px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        ⚡ <strong>Next Step:</strong> Our team will get in touch with you at <strong>${contactDoc.phone}</strong>. If you need urgent assistance, you can also request an instant phone call.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Thank you for reaching out to LOCAL2BRAND. We have received your inquiry.`,
    headerBadge: 'MESSAGE RECEIVED • CLIENT DESK',
    title: `Message Received!`,
    subtitle: `We will connect with you shortly.`,
    contentHtml,
    ctaText: 'Visit LOCAL2BRAND Website',
    ctaUrl: clientUrl,
  });

  return await sendEmail({ to: contactDoc.email, subject, html, text: `Thank you for contacting LOCAL2BRAND, ${contactName}! We received your inquiry and will contact you at ${contactDoc.phone}.`, isImportant: true, priority: 'high' });
};

// 6b. Lead / Proposal Status Update Email (to Client)
export const sendLeadStatusUpdateEmail = async (lead) => {
  if (!lead.email) return;
  const clientUrl = getClientUrl();
  const leadIdShort = (lead._id || '').toString().slice(-6).toUpperCase();
  const status = lead.status || 'Updated';
  const formattedStatus = formatStatusTitle(status);
  const pdfUrl = lead.drivePdfLink || lead.pdfUrl || lead.attachmentUrl;
  const notes = lead.adminNotes || '';
  const subject = `Proposal Status Update: ${formattedStatus} - ${lead.websiteType || 'LOCAL2BRAND'} (#${leadIdShort})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${lead.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        The status of your project proposal for <strong>${lead.websiteType}</strong> has been updated:
      </p>

      <div class="bg-box border-theme" style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 18px 22px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">Current Status</div>
        <div style="font-size: 20px; font-weight: 900; color: #15803d; letter-spacing: 0.5px;">${formattedStatus}</div>
      </div>

      ${pdfUrl ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #6366f1; border-radius: 14px; padding: 16px; margin: 16px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            📄 Official Project Proposal PDF Document Attached
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">
            Our strategy &amp; technical estimation team has prepared your customized project proposal PDF:
          </p>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 10px 22px; font-size: 13px; font-weight: 800; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
            Open / Download Proposal PDF
          </a>
          <div style="font-size: 11px; color: #64748b; margin-top: 8px; word-break: break-all;">
            Direct Link: <a href="${pdfUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline;">${pdfUrl}</a>
          </div>
        </div>
      ` : ''}

      ${notes ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-top: 14px; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Admin &amp; Strategy Notes:</div>
          <div class="text-body" style="font-size: 13px; color: #334155; word-break: break-word;">${notes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your proposal #${leadIdShort} status is now ${formattedStatus}.`,
    headerBadge: 'PROPOSAL STATUS UPDATE',
    title: `Proposal Status: ${formattedStatus}`,
    subtitle: `Reference: #${leadIdShort} &bull; ${formattedStatus}`,
    orderId: `#${leadIdShort}`,
    contentHtml,
    ctaText: 'Visit Client Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({
    to: lead.email,
    subject,
    html,
    text: `Your proposal #${leadIdShort} status is now ${status}`,
    isImportant: true,
    priority: 'high',
  });
};

// 7. Callback Scheduled Email (to Client)
export const sendCallbackConfirmationEmail = async (callback) => {
  if (!callback.email) return;
  const clientUrl = getClientUrl();
  const cbId = (callback._id || '').toString().slice(-6).toUpperCase();
  const subject = `Callback Confirmed: Consultation with LOCAL2BRAND (${cbId ? `#${cbId}` : 'Scheduled'})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${callback.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Your direct consultation callback has been scheduled with our senior engineering &amp; founding desk.
      </p>

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
    preheader: `Your consultation callback is confirmed for ${callback.preferredTime}.`,
    headerBadge: 'FOUNDER CALLBACK QUEUE',
    title: `Callback Request Confirmed`,
    subtitle: `We will call you at ${callback.phone} (${callback.preferredTime})`,
    orderId: cbId ? `CALL-${cbId}` : undefined,
    contentHtml,
    ctaText: 'Visit LOCAL2BRAND Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: callback.email, subject, html, text: `Callback request received for ${callback.phone}` });
};

// 8. Admin Alert on Callback Request
export const sendAdminCallbackAlert = async (callback) => {
  const clientUrl = getClientUrl();
  const recipients = getAdminRecipients();

  const subject = `New Callback Request: ${callback.name} (${callback.phone})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #fce7f3; border: 1px solid #fbcfe8; color: #be185d; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        REAL-TIME CALLBACK REQUEST
      </div>

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
    headerBadge: 'FOUNDER CALLBACK ALERT',
    title: `Instant Callback Request: ${callback.name}`,
    subtitle: `Client: ${callback.name} &bull; ${callback.phone}`,
    contentHtml,
    ctaText: 'Open Callbacks Queue in Admin',
    ctaUrl: `${clientUrl}/admin/callbacks`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Instant callback request from ${callback.name} (${callback.phone}) for ${callback.topic}`, isImportant: true, priority: 'high' });
};

// 8.1 Admin Alert on New User Registration
export const sendAdminNewUserAlertEmail = async ({ user }) => {
  const clientUrl = getClientUrl();
  const recipients = getAdminRecipients();

  const subject = `New User Registration: ${user.name} (${user.email}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <div style="display: inline-block; background-color: #dbeafe; border: 1px solid #bfdbfe; color: #1e40af; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        NEW CLIENT REGISTRATION
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">User Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #0f172a; width: 66%; font-size: 13px; vertical-align: top; word-break: break-word;">${user.name}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Email Address:</td>
          <td style="padding: 11px 12px; color: #2563eb; font-weight: 700; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="mailto:${user.email}" style="color: #2563eb; text-decoration: none;">${user.email}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone / WhatsApp:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #059669; font-family: monospace; font-size: 13px; vertical-align: top; word-break: break-all;">
            ${user.phone ? `<a href="tel:${user.phone}" style="color: #059669; text-decoration: none;">${user.phone}</a>` : 'Not provided'}
          </td>
        </tr>
        ${user.company ? `
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Company / Brand:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top;">${user.company}</td>
        </tr>` : ''}
        <tr>
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Registered At:</td>
          <td class="text-muted" style="padding: 11px 12px; color: #475569; font-size: 12px; vertical-align: top;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New user registration: ${user.name} (${user.email}).`,
    headerBadge: 'NEW USER REGISTRATION',
    title: `New User Joined LOCAL2BRAND`,
    subtitle: `${user.name} has created a new account.`,
    contentHtml,
    ctaText: 'View Users in Admin Panel',
    ctaUrl: `${clientUrl}/admin/users`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New user registered: ${user.name} (${user.email}, ${user.phone || 'No phone'})` });
};

// 9. Email Verification OTP Email
export const sendVerificationOtpEmail = async ({ user, otp, email }) => {
  const clientUrl = getClientUrl();
  const targetEmail = (user?.email || email || '').toLowerCase().trim();
  if (!targetEmail) {
    console.warn('sendVerificationOtpEmail notice: No recipient email provided');
    return { success: false, error: 'No recipient email' };
  }
  const userName = user?.name || 'Valued Client';
  const subject = `Your Verification Code: ${otp} - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${userName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Please use the following 6-digit One-Time Password (OTP) to verify your registered email address on <strong>LOCAL2BRAND</strong>:
      </p>

      <div class="bg-box border-theme" style="background-color: #f5f3ff; border: 2px dashed #8b5cf6; border-radius: 16px; padding: 22px; text-align: center; margin: 18px 0; box-sizing: border-box;">
        <div style="font-size: 11px; color: #6d28d9; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">
          Your 6-Digit Email Verification Code
        </div>
        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #7c3aed; font-family: monospace;">
          ${otp}
        </div>
        <div style="font-size: 11px; color: #8b5cf6; font-weight: 600; margin-top: 6px;">
          ⏳ Valid for 15 minutes. Do not share this code with anyone.
        </div>
      </div>

      <p class="text-muted" style="margin: 14px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
        If you did not request this verification code, please ignore this email or reach out to our security desk.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your verification OTP is ${otp}. Valid for 15 minutes.`,
    headerBadge: 'EMAIL VERIFICATION SECURITY',
    title: `Verify Your Account`,
    subtitle: `Use the one-time security code below to complete verification.`,
    contentHtml,
    ctaText: 'Enter Code in Client Dashboard',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: targetEmail, subject, html, text: `Your LOCAL2BRAND verification code is: ${otp}` });
};

// 10. Order Completed / Delivery Handover Email
export const sendOrderDeliveredEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || reqDoc.businessName || 'Your Business';
  const clientEmail = resolveClientEmail(reqDoc);
  const liveUrl = reqDoc.liveUrl || reqDoc.domain || clientUrl;
  const pdfUrl = reqDoc.drivePdfLink || reqDoc.pdfUrl || reqDoc.invoicePdfUrl || reqDoc.documentUrl;

  if (!clientEmail) {
    console.warn(`sendOrderDeliveredEmail notice: No client email found for ${reqId}`);
    return { success: false, error: 'No client email provided' };
  }

  const subject = `Project Delivered & Live: ${businessName} (#${reqId}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Congratulations ${clientName}! 🎉
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Your custom website for <strong>${businessName}</strong> has passed all architecture, SEO, and speed audits. It is now officially <strong>DELIVERED &amp; LIVE</strong>!
      </p>

      <div class="bg-box border-theme" style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 16px; padding: 20px; margin: 18px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px;">
          VIP Handover Completed
        </div>
        <div style="font-size: 22px; font-weight: 900; color: #15803d; letter-spacing: 0.5px; margin-bottom: 8px;">
          ${businessName} IS LIVE
        </div>
        <div style="font-size: 12px; color: #166534; font-weight: 600;">
          ⚡ Google Lighthouse Performance Verified &bull; SSL Secured &bull; Mobile Responsive
        </div>
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin: 14px 0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Order ID:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #4338ca; font-family: monospace; font-size: 14px; width: 66%; vertical-align: top;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Live Website:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #2563eb; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="${liveUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${liveUrl}</a>
          </td>
        </tr>
        <tr>
          <td class="text-muted" style="padding: 11px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">VIP Support:</td>
          <td style="padding: 11px 12px; font-weight: 700; color: #059669; font-size: 13px; vertical-align: top;">30 Days Hypercare &amp; Priority Support Active</td>
        </tr>
      </table>

      ${pdfUrl ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #10b981; border-radius: 14px; padding: 16px; margin: 16px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            📄 Official Handover &amp; Invoice PDF Document Attached
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">
            You can access and download your project delivery dossier / documentation:
          </p>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 10px 22px; font-size: 13px; font-weight: 800; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
            Download Handover PDF Document
          </a>
          <div style="font-size: 11px; color: #64748b; margin-top: 8px; word-break: break-all;">
            Direct Link: <a href="${pdfUrl}" target="_blank" style="color: #059669; text-decoration: underline;">${pdfUrl}</a>
          </div>
        </div>
      ` : ''}

      ${reqDoc.internalNotes ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-top: 14px; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Engineer Final Handover Notes:</div>
          <div class="text-body" style="font-size: 13px; color: #334155; word-break: break-word;">${reqDoc.internalNotes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Congratulations! ${businessName} is officially delivered and published live.`,
    headerBadge: 'PROJECT DELIVERY HANDOVER',
    title: `Your Website is Live!`,
    subtitle: `Project ${reqId} has been successfully completed and deployed.`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Open Client Console',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({
    to: clientEmail,
    subject,
    html,
    text: `Project ${reqId} for ${businessName} is now live and completed!`,
    isImportant: true,
    priority: 'high',
  });
};

// 11. Callback Status Update Email (to Client)
export const sendCallbackStatusUpdateEmail = async (callback, newStatus = '', customNotes = '', customPdfUrl = '') => {
  if (!callback.email) return;
  const clientUrl = getClientUrl();
  const cbId = (callback._id || callback.id || '').toString().slice(-6).toUpperCase();
  const status = (newStatus || callback.status || 'updated').toLowerCase();
  const notes = customNotes || callback.adminNotes || '';
  const pdfUrl = customPdfUrl || callback.drivePdfLink || callback.pdfUrl;

  let badge = 'CONSULTATION UPDATE';
  let title = 'Callback Request Status Updated';
  let subtitle = `Update regarding your consultation request for ${callback.phone}`;
  let statusBadgeColor = '#2563eb';
  let statusBadgeBg = '#eff6ff';
  let statusText = 'IN PROGRESS';
  let mainMessage = `Our consultation team has updated the status of your callback request regarding <strong>${callback.topic || 'Website Consultation'}</strong>.`;

  if (status === 'called') {
    badge = 'CONSULTATION CALL INITIATED';
    title = 'We Reached Out to You! 📞';
    subtitle = `Phone: ${callback.phone} • Preferred Slot: ${callback.preferredTime || 'Scheduled'}`;
    statusBadgeColor = '#2563eb';
    statusBadgeBg = '#eff6ff';
    statusText = 'CALLED / IN PROGRESS';
    mainMessage = `Our senior tech consultant attempted or connected via phone at <strong>${callback.phone}</strong> to discuss your website goals.`;
  } else if (status === 'resolved' || status === 'completed') {
    badge = 'CONSULTATION COMPLETED';
    title = 'Consultation Call Follow-up';
    subtitle = `Reference: #${cbId} • Strategy Summary`;
    statusBadgeColor = '#059669';
    statusBadgeBg = '#f0fdf4';
    statusText = 'RESOLVED / COMPLETED';
    mainMessage = `Thank you for consulting with the <strong>LOCAL2BRAND</strong> founding engineering desk regarding <strong>${callback.topic || 'your digital project'}</strong>.`;
  } else if (status === 'cancelled') {
    badge = 'REQUEST STATUS: CANCELLED';
    title = 'Callback Request Cancelled';
    subtitle = `Reference: #${cbId} • Closed`;
    statusBadgeColor = '#64748b';
    statusBadgeBg = '#f1f5f9';
    statusText = 'CANCELLED';
    mainMessage = `Your callback request for phone <strong>${callback.phone}</strong> has been cancelled in our queue. You may request a new session anytime.`;
  }

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${callback.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        ${mainMessage}
      </p>

      <div style="background-color: ${statusBadgeBg}; border: 1.5px solid ${statusBadgeColor}; border-radius: 14px; padding: 14px 20px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 10px; color: ${statusBadgeColor}; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">Consultation Status</div>
        <div style="font-size: 18px; font-weight: 900; color: ${statusBadgeColor}; letter-spacing: 0.5px;">${statusText}</div>
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 14px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Callback ID:</td>
          <td style="padding: 10px 12px; font-weight: 900; color: #4338ca; font-family: monospace; font-size: 13px; width: 66%; vertical-align: top;">#${cbId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 10px 12px; font-weight: 800; color: #059669; font-family: monospace; font-size: 13px; vertical-align: top;">${callback.phone}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600; vertical-align: top;">Topic:</td>
          <td class="text-title" style="padding: 10px 12px; font-weight: 700; color: #0f172a; font-size: 13px; vertical-align: top; word-break: break-word;">${callback.topic || 'General Consultation'}</td>
        </tr>
      </table>

      ${pdfUrl ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #6366f1; border-radius: 14px; padding: 16px; margin: 16px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            📄 Consultation Roadmap / Scope PDF Attached
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">
            Please find your customized project strategy / proposal document attached:
          </p>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 10px 22px; font-size: 13px; font-weight: 800; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
            Open / Download Strategy PDF
          </a>
        </div>
      ` : ''}

      ${notes ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; border: 1px solid #e2e8f0; margin: 14px 0; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Consultant Notes &amp; Recommendations:</div>
          <div class="text-body" style="font-size: 13px; color: #334155; line-height: 1.6; word-break: break-word;">${notes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Update on your consultation request for ${callback.phone} — Status: ${statusText}`,
    headerBadge: badge,
    title,
    subtitle,
    contentHtml,
    ctaText: 'Visit Client Portal',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({
    to: callback.email,
    subject: `Consultation Update: ${statusText} - LOCAL2BRAND (#${cbId})`,
    html,
    text: `Your callback request #${cbId} for ${callback.phone} status is now: ${statusText}.`,
    isImportant: true,
    priority: 'high',
  });
};

export const sendCallbackResolutionEmail = async (callback) => {
  return await sendCallbackStatusUpdateEmail(callback, 'resolved');
};

// 13. Game Reward Won Email
export const sendGameRewardWinEmail = async ({ user, prize }) => {
  if (!user || !user.email || !prize) return;
  const clientUrl = getClientUrl();
  const subject = `You won ${prize.label} - Claim Your Launch Voucher!`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hi ${user.name || 'Valued Partner'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Woohoo! You just played the interactive reward game on <strong>LOCAL2BRAND</strong> and unlocked an exclusive launch discount:
      </p>

      <div class="bg-box border-theme" style="background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%); border: 2px solid #a855f7; border-radius: 16px; padding: 20px; margin: 16px 0; text-align: center; color: #ffffff; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.25);">
        <div style="font-size: 28px; margin-bottom: 6px;">${prize.icon || '🎁'}</div>
        <div style="font-size: 18px; font-weight: 900; color: #fef08a; letter-spacing: 0.5px;">${prize.label}</div>
        <div style="font-size: 13px; color: #e9d5ff; margin: 4px 0 14px 0;">${prize.subLabel || 'Exclusive Client Launch Voucher'}</div>
        
        <div style="display: inline-block; background-color: #0f172a; border: 1px dashed #c084fc; border-radius: 10px; padding: 10px 20px; font-family: monospace; font-size: 18px; font-weight: 900; color: #34d399; letter-spacing: 2px;">
          ${prize.code}
        </div>
        <div style="font-size: 11px; color: #a78bfa; margin-top: 8px;">
          ⚡ Valid for the next 7 days on all website plans &amp; custom builds
        </div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `You won ${prize.label} on LOCAL2BRAND! Use code ${prize.code} to save.`,
    headerBadge: 'REWARD GAME WINNER',
    title: `You Won a Special Launch Reward!`,
    subtitle: `Exclusive Voucher Code: ${prize.code}`,
    contentHtml,
    ctaText: 'Claim Voucher & Start Website',
    ctaUrl: `${clientUrl}/get-started?promo=${prize.code}`,
  });

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text: `Congratulations ${user.name}! You won ${prize.label} (Code: ${prize.code}). Claim your reward at ${clientUrl}/get-started?promo=${prize.code}`
  });
};

// 14. Requirement Deletion / Cancellation Notice (to Client)
export const sendRequirementDeletionEmail = async (reqDoc, reason = '') => {
  const clientEmail = resolveClientEmail(reqDoc);
  if (!clientEmail) {
    console.warn('sendRequirementDeletionEmail notice: No recipient client email found');
    return { success: false, error: 'No client email' };
  }

  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || (reqDoc._id ? reqDoc._id.toString().slice(-6).toUpperCase() : 'REQ-ID');
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || reqDoc.businessName || 'Website Project';

  const subject = `Project Specification Update: #${reqId} (${businessName}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        This email is to confirm that your project requirement specification for <strong>${businessName}</strong> (Ref: <code style="font-family: monospace; font-weight: 800; color: #4338ca;">#${reqId}</code>) has been archived in our queue.
      </p>

      ${reason ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; margin: 14px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Status Note:</div>
          <div style="font-size: 13px; font-weight: 600; color: #1e293b; line-height: 1.5;">${reason}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Update on project requirement #${reqId} for ${businessName}.`,
    headerBadge: 'PROJECT STATUS UPDATE',
    title: `Project Specification Archived`,
    subtitle: `Project #${reqId} &bull; ${businessName}`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Start a New Website Project',
    ctaUrl: `${clientUrl}/get-started`,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Project specification #${reqId} for ${businessName} archived. Reason: ${reason || 'N/A'}` });
};

// 14b. Requirement Rejection Notice (to Client)
export const sendRequirementRejectedEmail = async (reqDoc, reason = '') => {
  const clientEmail = resolveClientEmail(reqDoc);
  if (!clientEmail) {
    console.warn('sendRequirementRejectedEmail notice: No recipient client email found');
    return { success: false, error: 'No client email' };
  }

  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || (reqDoc._id ? reqDoc._id.toString().slice(-6).toUpperCase() : 'REQ-ID');
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || reqDoc.businessName || 'Website Project';

  const subject = `Project Specification Review: #${reqId} (${businessName}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Thank you for submitting your website specifications for <strong>${businessName}</strong> (Ref: <code style="font-family: monospace; font-weight: 800; color: #4338ca;">#${reqId}</code>). Our engineering and architecture team has reviewed your requirements.
      </p>

      ${reason ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; margin: 16px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Architecture Review Feedback:</div>
          <div style="font-size: 13px; font-weight: 600; color: #1e293b; line-height: 1.5;">${reason}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Architecture review feedback for project #${reqId} (${businessName}).`,
    headerBadge: 'PROJECT ARCHITECTURE REVIEW',
    title: `Project Review &amp; Recommendations`,
    subtitle: `Project #${reqId} &bull; ${businessName}`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Submit Revised Requirement Form',
    ctaUrl: `${clientUrl}/get-started`,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Project review for #${reqId} (${businessName}): ${reason || 'Parameters require revision.'}` });
};

// 15. Admin Alert on Requirement Deletion
export const sendAdminRequirementDeletionAlert = async (reqDoc, reason = '') => {
  const recipients = getAdminRecipients();
  const reqId = reqDoc.requirementId || (reqDoc._id ? reqDoc._id.toString() : 'REQ-ID');
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || 'Client';
  const clientEmail = resolveClientEmail(reqDoc) || reqDoc.clientInfo?.email || 'No email';
  const clientPhone = reqDoc.clientInfo?.mobile || 'No phone';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || 'Project';

  const subject = `Requirement Archived: #${reqId} (${businessName}) - Admin Alert`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        A project requirement submission has been archived via the Admin Console.
      </p>

      ${reason ? `
        <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; margin: 14px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Reason:</div>
          <div style="font-size: 13px; font-weight: 700; color: #1e293b; line-height: 1.5;">${reason}</div>
        </div>
      ` : ''}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 12px;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600; width: 34%;">Requirement ID:</td>
          <td style="padding: 10px 12px; font-family: monospace; font-weight: 800; color: #4338ca; font-size: 13px;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600;">Business / Brand:</td>
          <td class="text-title" style="padding: 10px 12px; font-weight: 800; color: #0f172a; font-size: 13px;">${businessName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600;">Client:</td>
          <td style="padding: 10px 12px; color: #334155; font-size: 13px; font-weight: 700;">${clientName} (${clientPhone} &bull; ${clientEmail})</td>
        </tr>
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Requirement #${reqId} (${businessName}) archived.`,
    headerBadge: 'RECORD ARCHIVED',
    title: `Requirement Archived`,
    subtitle: `Record: #${reqId} &bull; ${businessName}`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Open Requirements Console',
    ctaUrl: `${getClientUrl()}/admin/requirements`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Requirement #${reqId} for ${businessName} archived. Reason: ${reason || 'N/A'}` });
};

// 16. Callback Request Deletion Notice (to Client)
export const sendCallbackDeletionEmail = async (callback) => {
  if (!callback.email) return;
  const clientUrl = getClientUrl();
  const subject = `Callback Request Closed - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hi ${callback.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Your consultation callback request for phone <strong>${callback.phone}</strong> regarding <strong>${callback.topic || 'Website Consultation'}</strong> has been processed and closed in our queue.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your callback request has been closed.`,
    headerBadge: 'CALLBACK CLOSED',
    title: `Callback Request Closed`,
    subtitle: `Phone: ${callback.phone} &bull; ${callback.topic || 'Consultation'}`,
    contentHtml,
    ctaText: 'Request Instant Callback',
    ctaUrl: `${clientUrl}/contact`,
  });

  return await sendEmail({ to: callback.email, subject, html, text: `Your callback request for ${callback.phone} has been closed.` });
};

// 17. Admin Alert on Callback Deletion
export const sendAdminCallbackDeletionAlert = async (callback) => {
  const recipients = getAdminRecipients();
  const subject = `Callback Deleted: ${callback.name} (${callback.phone}) - Admin Alert`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        A callback request was deleted from the admin database.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 12px;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600; width: 34%;">Client Name:</td>
          <td class="text-title" style="padding: 10px 12px; font-weight: 800; color: #0f172a; font-size: 13px;">${callback.name}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600;">Phone:</td>
          <td style="padding: 10px 12px; font-family: monospace; font-weight: 800; color: #059669; font-size: 13px;">${callback.phone}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600;">Topic:</td>
          <td style="padding: 10px 12px; color: #334155; font-size: 13px;">${callback.topic || 'General'}</td>
        </tr>
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Callback for ${callback.name} (${callback.phone}) deleted.`,
    headerBadge: 'ADMIN CALLBACK DELETION',
    title: `Callback Request Deleted`,
    subtitle: `${callback.name} &bull; ${callback.phone}`,
    contentHtml,
    ctaText: 'Open Callbacks Queue',
    ctaUrl: `${getClientUrl()}/admin/callbacks`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Callback for ${callback.name} (${callback.phone}) deleted.` });
};

// 18. Service Offering Deletion Notice (to Admin)
export const sendServiceDeletionAlert = async (service) => {
  const recipients = getAdminRecipients();
  const subject = `Service Package Removed: ${service.title || 'Service Offering'} - Admin Alert`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        The service package <strong>${service.title}</strong> (Slug: <code>${service.slug}</code>) has been deleted from the database.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Service package ${service.title} deleted.`,
    headerBadge: 'SERVICE DELETION',
    title: `Service Package Removed`,
    subtitle: `${service.title} &bull; ${service.startingPrice || ''}`,
    contentHtml,
    ctaText: 'Open Services CMS',
    ctaUrl: `${getClientUrl()}/admin/services`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Service package ${service.title} deleted.` });
};

// 19. Contact Query / Lead Deletion Notice (to Client & Admin)
export const sendQueryDeletionEmail = async (queryDoc) => {
  if (!queryDoc.email) return;
  const clientUrl = getClientUrl();
  const subject = `Inquiry Ticket #${(queryDoc._id || '').toString().slice(-6).toUpperCase()} Closed - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hi ${queryDoc.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Your contact inquiry regarding <strong>${queryDoc.service || queryDoc.requirements || 'Website Project'}</strong> has been processed and closed.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your inquiry has been closed.`,
    headerBadge: 'INQUIRY CLOSED',
    title: `Inquiry Ticket Closed`,
    subtitle: `${queryDoc.name} &bull; ${queryDoc.service || 'Website Project'}`,
    contentHtml,
    ctaText: 'Contact LOCAL2BRAND',
    ctaUrl: `${clientUrl}/contact`,
  });

  return await sendEmail({ to: queryDoc.email, subject, html, text: `Your inquiry for ${queryDoc.service || 'Website Project'} has been closed.` });
};

export const sendAdminQueryDeletionAlert = async (queryDoc) => {
  const recipients = getAdminRecipients();
  const subject = `Inquiry Deleted: ${queryDoc.name || 'Lead'} - Admin Alert`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        A contact query / lead record was deleted from the database.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 12px;">
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600; width: 34%;">Client:</td>
          <td class="text-title" style="padding: 10px 12px; font-weight: 800; color: #0f172a; font-size: 13px;">${queryDoc.name} (${queryDoc.phone || 'No phone'} &bull; ${queryDoc.email || 'No email'})</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #e2e8f0;">
          <td class="text-muted" style="padding: 10px 12px; color: #64748b; font-size: 12px; font-weight: 600;">Service/Requirement:</td>
          <td style="padding: 10px 12px; color: #334155; font-size: 13px;">${queryDoc.service || queryDoc.requirements || 'General'}</td>
        </tr>
      </table>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Lead for ${queryDoc.name} deleted.`,
    headerBadge: 'ADMIN LEAD DELETION',
    title: `Inquiry Record Deleted`,
    subtitle: `${queryDoc.name} &bull; ${queryDoc.email || queryDoc.phone}`,
    contentHtml,
    ctaText: 'Open Leads Console',
    ctaUrl: `${getClientUrl()}/admin/leads`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Lead for ${queryDoc.name} deleted.` });
};

// 20. VIP WhatsApp Priority Direct Developer Support Activated Notice (to Client)
export const sendVipWhatsappActivatedEmail = async ({ user }) => {
  if (!user || !user.email) return { success: false, error: 'No user email' };

  const clientUrl = getClientUrl();
  const clientName = user.name || 'Valued Client';
  const whatsappNumber = process.env.WHATSAPP_SUPPORT || '+918710043923';
  const cleanWaNumber = whatsappNumber.replace(/\D/g, '');
  const directWaLink = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Hello Local2Brand Founder Team! 👋 I am contacting you via my VIP WhatsApp Priority line (Account: ${user.email}).`)}`;

  const subject = `Direct WhatsApp Chat Unlocked - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hello ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Exciting news! You have <strong style="color: #10b981;">unlocked direct 1-on-1 WhatsApp Chat</strong> with our senior engineers and founders.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${directWaLink}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
          Open VIP WhatsApp Support
        </a>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `You have unlocked an exclusive feature: Direct WhatsApp Chat.`,
    headerBadge: 'VIP FEATURE UNLOCKED',
    title: `Direct WhatsApp Chat Unlocked!`,
    subtitle: `${clientName} &bull; Direct Architect Access`,
    contentHtml,
    ctaText: 'Open Client Console',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `Hello ${clientName}, you have unlocked Direct 1-on-1 WhatsApp Chat for your account (${user.email}). Reach us on WhatsApp: ${directWaLink}` });
};

// 21. Admin Alert on New Review Submission
export const sendAdminNewReviewEmail = async ({ review, user }) => {
  const recipients = getAdminRecipients();
  const reviewerName = review.userName || user?.name || 'Client';
  const reviewerEmail = review.userEmail || user?.email || 'N/A';
  const rating = review.rating || 5;
  const stars = '⭐'.repeat(rating);
  const subject = `New Review (${rating}/5): ${reviewerName} - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        A new client review was submitted on LOCAL2BRAND.
      </p>
      <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin: 16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 32%;">Rating:</td>
            <td style="padding: 6px 0; font-size: 16px; font-weight: 800; color: #f59e0b;">${stars} (${rating} / 5)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Client:</td>
            <td style="padding: 6px 0; font-weight: 800; color: #0f172a;">${reviewerName} (${reviewerEmail})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Role / Brand:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #4338ca;">${review.userRole || 'Business Owner'} &bull; ${review.businessName || 'LOCAL2BRAND'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0 4px 0; color: #64748b; font-weight: 600; vertical-align: top;">Feedback:</td>
            <td style="padding: 10px 0 4px 0; color: #1e293b; font-style: italic; line-height: 1.5;">"${review.comment}"</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New ${rating}-star review from ${reviewerName}.`,
    headerBadge: 'NEW CLIENT REVIEW',
    title: `New Review Submitted`,
    subtitle: `${reviewerName} &bull; ${stars}`,
    contentHtml,
    ctaText: 'Moderate Reviews in Admin',
    ctaUrl: `${getClientUrl()}/admin/reviews`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New ${rating}-star review from ${reviewerName} (${reviewerEmail}): "${review.comment}"` });
};

// 22. Client Confirmation on Review Submission
export const sendReviewSubmittedClientEmail = async ({ review, user }) => {
  const targetEmail = review.userEmail || user?.email;
  if (!targetEmail) return { success: false, error: 'No recipient email' };

  const clientName = review.userName || user?.name || 'Valued Client';
  const rating = review.rating || 5;
  const stars = '⭐'.repeat(rating);
  const subject = `Thank You for Your Feedback! - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Thank you for sharing your review with us! We truly appreciate your trust and partnership.
      </p>

      <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin: 16px 0;">
        <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>
        <div style="font-size: 13px; color: #334155; font-style: italic; line-height: 1.6;">
          "${review.comment}"
        </div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Thank you for reviewing LOCAL2BRAND!`,
    headerBadge: 'FEEDBACK RECEIVED',
    title: `Thank You for Your Review!`,
    subtitle: `${clientName} &bull; ${stars}`,
    contentHtml,
    ctaText: 'View Showcase',
    ctaUrl: `${getClientUrl()}/portfolio`,
  });

  return await sendEmail({ to: targetEmail, subject, html, text: `Hi ${clientName}, thank you for your review on LOCAL2BRAND!` });
};

// 23. Client Notice When Review is Approved & Published Live
export const sendReviewApprovedClientEmail = async ({ review }) => {
  if (!review.userEmail) return { success: false, error: 'No recipient email' };

  const clientName = review.userName || 'Valued Client';
  const rating = review.rating || 5;
  const stars = '⭐'.repeat(rating);
  const subject = `Your Review is Now Live on LOCAL2BRAND Showcase!`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Great news! Your review for <strong>${review.businessName || 'LOCAL2BRAND'}</strong> has been verified and published live on our official website showcase.
      </p>

      <div class="bg-box border-theme" style="background-color: #f8fafc; border: 1.5px solid #10b981; border-radius: 14px; padding: 16px 18px; margin: 16px 0;">
        <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>
        <div style="font-size: 13px; color: #334155; font-style: italic; line-height: 1.6;">
          "${review.comment}"
        </div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your review is now published live on LOCAL2BRAND.`,
    headerBadge: 'REVIEW PUBLISHED',
    title: `Your Review is Live!`,
    subtitle: `${clientName} &bull; ${review.businessName || 'Client Showcase'}`,
    contentHtml,
    ctaText: 'View Live Showcase',
    ctaUrl: `${getClientUrl()}/portfolio`,
  });

  return await sendEmail({ to: review.userEmail, subject, html, text: `Hi ${clientName}, your review is now live on LOCAL2BRAND!` });
};

// 24. OTP Verification Code for Changing Registered Account Email
export const sendEmailChangeOtpEmail = async ({ to, userName, otp }) => {
  if (!to) return { success: false, error: 'No recipient email' };

  const clientName = userName || 'Valued Client';
  const subject = `Verify Your New Email Address: ${otp} - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Hello ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        You recently requested to update your LOCAL2BRAND registered account email address to <strong>${to}</strong>.
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        Please enter the 6-digit security verification code below in your Client Console to confirm and complete this change:
      </p>

      <div style="text-align: center; margin: 24px 0; padding: 18px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%); border: 2px dashed #7c3aed; border-radius: 16px;">
        <span style="font-size: 32px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #7c3aed;">
          ${otp}
        </span>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;">
          ⏳ This verification code expires in 10 minutes.
        </p>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your 6-digit email change verification code is ${otp}.`,
    headerBadge: 'SECURITY VERIFICATION',
    title: `Verify New Email Address`,
    subtitle: `${clientName} &bull; Account Security Update`,
    contentHtml,
    ctaText: 'Open Client Console',
    ctaUrl: `${getClientUrl()}/dashboard?tab=profile`,
  });

  return await sendEmail({ to, subject, html, text: `Hello ${clientName}, your 6-digit email change verification code is: ${otp}` });
};

// 25. Admin Alert When User Changes Email Address
export const sendAdminUserEmailChangedEmail = async ({ user, oldEmail, newEmail }) => {
  const recipients = getAdminRecipients();
  const userName = user?.name || 'Client';
  const userId = user?._id || user?.id || 'N/A';
  const changeDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const subject = `Security Notice: Client Email Changed (${userName}) - LOCAL2BRAND`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
        Admin Security Notice: Registered Email Address Updated
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #334155; line-height: 1.6;">
        A client has successfully verified and updated their registered account email address via 6-digit OTP verification.
      </p>

      <div class="bg-box border-theme" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 16px 18px; margin: 16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 35%;">Client Name:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 800;">${userName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Previous Email:</td>
            <td style="padding: 6px 0; color: #e11d48; font-family: monospace; font-weight: 700;">${oldEmail}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">New Verified Email:</td>
            <td style="padding: 6px 0; color: #059669; font-family: monospace; font-weight: 800;">${newEmail}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Client ${userName} changed registered email from ${oldEmail} to ${newEmail}.`,
    headerBadge: 'SECURITY AUDIT',
    title: `Client Email Address Changed`,
    subtitle: `${userName} &bull; ${newEmail}`,
    contentHtml,
    ctaText: 'View in User Directory',
    ctaUrl: `${getClientUrl()}/admin/users`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Client ${userName} (${userId}) updated email from ${oldEmail} to ${newEmail} on ${changeDate}.` });
};
