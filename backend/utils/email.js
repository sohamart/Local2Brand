import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dataStore } from '../config/dataAdapter.js';

dotenv.config();

// Universal Base URL Resolver for WEBLETS (Always points to official domain or client URL)
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

  if (!base || base.includes('local2brand') || base.includes('local2brandofficial')) {
    base = 'https://weblets.bond';
  }

  if (!path) return base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// Cached singleton transporter
let cachedTransporter = null;
let lastTransporterKey = '';

let cachedFallbackTransporter = null;
let lastFallbackKey = '';

/**
 * Creates or retrieves Google / Gmail App Password SMTP Transporter
 */
const createTransporter = () => {
  try {
    dotenv.config({ override: true });
  } catch (e) {}

  // Support EMAIL_USER / GMAIL_USER / SMTP_USER / RESEND_API_KEY
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const user = (process.env.EMAIL_USER || process.env.GMAIL_USER || process.env.SMTP_USER || (resendApiKey ? 'resend' : '')).trim();
  const pass = (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || process.env.SMTP_PASS || resendApiKey || '').trim();
  let host = (process.env.EMAIL_HOST || '').trim();
  let port = process.env.EMAIL_PORT || '465';

  if (!host) {
    if (resendApiKey || pass.startsWith('re_')) {
      host = 'smtp.resend.com';
      port = '465';
    } else if (user.includes('@gmail.com')) {
      host = 'smtp.gmail.com';
      port = '465';
    } else if (pass.startsWith('xkeysib-')) {
      host = 'smtp-relay.brevo.com';
      port = '587';
    } else {
      host = 'smtp.gmail.com';
    }
  }

  const currentKey = `${host}:${port}:${user}:${pass}`;
  if (cachedTransporter && lastTransporterKey === currentKey) {
    return cachedTransporter;
  }

  if (pass && pass !== 'your_smtp_app_password' && pass !== 'your_16_digit_google_app_password') {
    // If it's a Gmail account or smtp.gmail.com
    if (host === 'smtp.gmail.com' || user.includes('@gmail.com')) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        pool: true,
        maxConnections: 1,
        maxMessages: 100,
      });
    } else {
      const isPort465 = Number(port) === 465;
      cachedTransporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: isPort465,
        auth: {
          user: user || (host.includes('resend') ? 'resend' : user),
          pass,
        },
        pool: true,
        maxConnections: 2,
        tls: { rejectUnauthorized: false },
      });
    }
    lastTransporterKey = currentKey;
    return cachedTransporter;
  }

  return null;
};

const createFallbackTransporter = () => {
  const user = (process.env.FALLBACK_EMAIL_USER || process.env.FALLBACK_GMAIL_USER || '').trim();
  const pass = (process.env.FALLBACK_EMAIL_PASS || process.env.FALLBACK_GMAIL_PASS || '').trim();
  const host = (process.env.FALLBACK_EMAIL_HOST || 'smtp.gmail.com').trim();
  const port = process.env.FALLBACK_EMAIL_PORT || 465;

  const currentKey = `${host}:${port}:${user}:${pass}`;
  if (cachedFallbackTransporter && lastFallbackKey === currentKey) {
    return cachedFallbackTransporter;
  }

  if (user && pass) {
    if (host === 'smtp.gmail.com' || user.includes('@gmail.com')) {
      cachedFallbackTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    } else {
      cachedFallbackTransporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });
    }
    lastFallbackKey = currentKey;
    return cachedFallbackTransporter;
  }

  return null;
};

// Helper to format status strings to clean title case
export const formatStatusTitle = (status = '') => {
  if (!status) return 'Updated';
  return String(status)
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

// Central helper to resolve active admin email recipients
export const getAdminRecipients = () => {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
  const adminAlertEmail = (process.env.ADMIN_ALERT_EMAIL || '').trim();
  const brandEmail = (process.env.BRAND_EMAIL || '').trim();
  const supportEmail = (process.env.SUPPORT_EMAIL || '').trim();
  const emailUser = (process.env.EMAIL_USER || '').trim();

  const rawList = [
    adminEmail,
    adminAlertEmail,
    brandEmail,
    supportEmail,
    emailUser,
    'sohamduttabwn@gmail.com',
    'admin@local2brand.com',
    'contact@weblets.bond',
  ];

  const validSet = new Set();
  for (const item of rawList) {
    if (item && typeof item === 'string') {
      const clean = item.trim().toLowerCase();
      if (clean.includes('@') && !clean.includes('example.com')) {
        validSet.add(clean);
      }
    }
  }

  if (validSet.size === 0) {
    validSet.add('sohamduttabwn@gmail.com');
  }

  return Array.from(validSet);
};

// Anti-Spam Plaintext Extractor
const htmlToPlainText = (html = '') => {
  if (!html) return '';
  return html
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
    .trim();
};

/**
 * Anti-Spam Sequential FIFO Email Queue
 * Ensures emails are dispatched one-by-one with a safe interval (~1.5s delay)
 * to avoid triggering Google / ISP anti-spam and burst blocking.
 */
class EmailQueueManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.delayMs = 1200; // 1.2s inter-message pace
    this.hasLoggedAuthWarning = false;
  }

  enqueue(emailTask) {
    return new Promise((resolve) => {
      this.queue.push({ ...emailTask, resolve, retries: 0 });
      this.processNext();
    });
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const current = this.queue.shift();

    try {
      const result = await this.sendSingleEmail(current);
      if (current.resolve) current.resolve(result);
    } catch (err) {
      const isAuthError =
        err.message?.includes('535') ||
        err.message?.includes('BadCredentials') ||
        err.message?.includes('Invalid login') ||
        err.code === 'EAUTH';

      if (isAuthError) {
        if (!this.hasLoggedAuthWarning) {
          this.hasLoggedAuthWarning = true;
          console.error(`\n======================================================`);
          console.error(`❌ [GMAIL SMTP AUTHENTICATION FAILED]`);
          console.error(`Google rejected credentials: 535 BadCredentials`);
          console.error(`👉 Action Required: Generate a fresh 16-character App Password at:`);
          console.error(`   https://myaccount.google.com/apppasswords`);
          console.error(`   and update EMAIL_PASS in backend/.env`);
          console.error(`======================================================\n`);
        }
        const cleanPreview = current.text || htmlToPlainText(current.html);
        console.log(`📧 [EMAIL NOT DELIVERED LIVE DUE TO BAD CREDENTIALS]`);
        console.log(`   To: ${Array.isArray(current.to) ? current.to.join(', ') : current.to}`);
        console.log(`   Subject: ${current.subject}`);
        if (cleanPreview) {
          console.log(`   Preview:\n${cleanPreview.slice(0, 200)}...\n`);
        }
        // Do NOT retry bad auth credentials (fast-fail)
        if (current.resolve) {
          current.resolve({
            success: false,
            isAuthError: true,
            error: 'Gmail SMTP Authentication Failed: Invalid Google App Password in .env',
          });
        }
      } else if (current.retries < 1) {
        current.retries += 1;
        console.warn(`[EmailQueue] Retrying email to ${current.to} (Attempt ${current.retries}/1)...`);
        this.queue.push(current);
      } else if (current.resolve) {
        current.resolve({ success: false, error: err.message });
      }
    } finally {
      setTimeout(() => {
        this.isProcessing = false;
        this.processNext();
      }, this.delayMs);
    }
  }

  async sendSingleEmail({ to, subject, html, text, headers = {} }) {
    const rawUser = (process.env.EMAIL_USER || process.env.GMAIL_USER || 'sohamduttabwn@gmail.com').trim();
    let fromEmail = process.env.EMAIL_FROM || `"WEBLETS" <${rawUser}>`;
    const supportEmail = process.env.SUPPORT_EMAIL || 'contact@weblets.bond';
    const clientUrl = getClientUrl();

    const cleanText = text || htmlToPlainText(html);
    const transporter = createTransporter();

    if (!transporter) {
      console.log(`\n======================================================`);
      console.log(`📧 [EMAIL SIMULATION] (Configure EMAIL_USER & EMAIL_PASS in .env for live Gmail sending)`);
      console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content:\n${cleanText || 'HTML Content'}`);
      console.log(`======================================================\n`);
      return { success: true, simulated: true };
    }

    const emailHeaders = {
      'X-Entity-Ref-ID': `WEBLETS-${Date.now()}`,
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      ...headers,
    };

    const rawTo = Array.isArray(to) ? to.join(', ') : to;

    try {
      const info = await transporter.sendMail({
        from: fromEmail,
        replyTo: fromEmail,
        to: rawTo,
        subject,
        text: cleanText,
        html,
        headers: emailHeaders,
      });

      console.log(`✅ [EmailQueue] Sent successfully to ${rawTo} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (primaryErr) {
      console.warn(`⚠️ [EmailQueue] Primary Gmail SMTP error for ${rawTo}:`, primaryErr.message);

      const fallbackTransporter = createFallbackTransporter();
      if (fallbackTransporter) {
        try {
          const fallbackUser = (process.env.FALLBACK_EMAIL_USER || process.env.FALLBACK_GMAIL_USER || supportEmail).trim();
          const fbInfo = await fallbackTransporter.sendMail({
            from: `"WEBLETS" <${fallbackUser}>`,
            replyTo: `"WEBLETS Support" <${supportEmail}>`,
            to: rawTo,
            subject,
            text: cleanText,
            html,
            headers: emailHeaders,
          });
          console.log(`✅ [EmailQueue] Sent via FALLBACK SMTP to ${rawTo} (MessageId: ${fbInfo.messageId})`);
          return { success: true, messageId: fbInfo.messageId };
        } catch (fbErr) {
          console.error(`❌ [EmailQueue] Fallback SMTP also failed:`, fbErr.message);
        }
      }

      throw primaryErr;
    }
  }
}

const globalEmailQueue = new EmailQueueManager();

/**
 * Public sendEmail interface — routes through the anti-spam sequential queue
 */
export const sendEmail = async ({ to, subject, html, text, priority = 'high', isImportant = true, headers = {} }) => {
  return await globalEmailQueue.enqueue({ to, subject, html, text, headers });
};

/**
 * Universal WEBLETS Device-Adaptive Branded Email Wrapper
 */
export const wrapAgencyEmail = ({ preheader, headerBadge, title, subtitle, contentHtml, ctaText, ctaUrl, footerNote, orderId }) => {
  const currentYear = new Date().getFullYear();
  const clientUrl = getClientUrl();
  const supportEmail = process.env.SUPPORT_EMAIL || 'contact@weblets.bond';
  const logoImgUrl = 'https://res.cloudinary.com/tm2pwzjj/image/upload/v1789400789/weblets_assets/weblets_logo_official.jpg';

  return `<!DOCTYPE html>
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
    body { margin: 0; padding: 0; width: 100% !important; background-color: #06080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    a { text-decoration: none; }

    @media (prefers-color-scheme: light) {
      body, .bg-body { background-color: #f8fafc !important; }
      .bg-card { background-color: #ffffff !important; border-color: #e2e8f0 !important; color: #0f172a !important; }
      .bg-header { background-color: #ffffff !important; border-color: #f1f5f9 !important; }
      .bg-box { background-color: #f8fafc !important; border-color: #e2e8f0 !important; }
      .bg-footer { background-color: #f1f5f9 !important; border-color: #e2e8f0 !important; }
      .text-title { color: #0f172a !important; }
      .text-body { color: #334155 !important; }
      .text-muted { color: #64748b !important; }
      .border-theme { border-color: #e2e8f0 !important; }
    }

    @media (prefers-color-scheme: dark) {
      body, .bg-body { background-color: #06080d !important; }
      .bg-card { background-color: #0d111c !important; border-color: #1e293b !important; color: #f8fafc !important; }
      .bg-header { background-color: #0d111c !important; border-color: #1e293b !important; }
      .bg-box { background-color: #131b2e !important; border-color: #1e293b !important; }
      .bg-footer { background-color: #06080d !important; border-color: #1e293b !important; }
      .text-title { color: #ffffff !important; }
      .text-body { color: #cbd5e1 !important; }
      .text-muted { color: #94a3b8 !important; }
      .border-theme { border-color: #1e293b !important; }
      .badge-theme { background-color: rgba(124, 58, 237, 0.2) !important; border-color: rgba(168, 85, 247, 0.4) !important; color: #c084fc !important; }
      .id-badge { background-color: #1e1b4b !important; border-color: #4338ca !important; color: #a5b4fc !important; }
    }
  </style>
</head>
<body class="bg-body" style="margin: 0; padding: 24px 8px; background-color: #06080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #06080d; opacity: 0;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  ` : ''}

  <div style="width: 100%; max-width: 560px; margin: 0 auto; box-sizing: border-box;">
    <div class="bg-card border-theme" style="background-color: #0d111c; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); box-sizing: border-box; width: 100%;">
      
      <div style="height: 4px; width: 100%; background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 50%, #ec4899 100%); line-height: 4px; font-size: 4px;">&nbsp;</div>

      <div class="bg-header border-theme" style="padding: 26px 24px 20px 24px; text-align: center; border-bottom: 1px solid #1e293b; background-color: #0d111c; box-sizing: border-box;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto; text-align: center;">
          <tr>
            <td align="center" style="vertical-align: middle;">
              <a href="${clientUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoImgUrl}" alt="WEBLETS Logo" width="56" height="56" style="width: 56px; height: 56px; border-radius: 14px; display: block; margin: 0 auto; object-fit: cover; border: 1px solid #334155; box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);" />
              </a>
            </td>
          </tr>
        </table>

        <div class="badge-theme" style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background-color: rgba(124, 58, 237, 0.2); border: 1px solid rgba(168, 85, 247, 0.4); color: #c084fc; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
          ${headerBadge || 'OFFICIAL WEBLETS DISPATCH'}
        </div>
        <h1 class="text-title" style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; line-height: 1.2;">
          WEBLETS
        </h1>
        <p class="text-muted" style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
          Lets Make Website Together &bull; Official Digital Studio
        </p>

        ${orderId ? `
          <div style="margin-top: 14px;">
            <div class="id-badge" style="display: inline-block; padding: 6px 16px; border-radius: 12px; background-color: #1e1b4b; border: 1.5px dashed #6366f1; color: #a5b4fc; font-size: 14px; font-weight: 900; font-family: monospace; letter-spacing: 1.5px;">
              ORDER ID: ${orderId}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="bg-card" style="padding: 22px 24px 8px 24px; background-color: #0d111c; box-sizing: border-box;">
        <h2 class="text-title" style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.35;">
          ${title}
        </h2>
        ${subtitle ? `<p class="text-muted" style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; font-weight: 500;">${subtitle}</p>` : ''}
      </div>

      <div class="bg-card text-body" style="padding: 6px 24px 28px 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1; background-color: #0d111c; box-sizing: border-box;">
        ${contentHtml}

        ${ctaText && ctaUrl ? `
          <div style="margin-top: 28px; margin-bottom: 8px; text-align: center;">
            <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%); color: #ffffff !important; padding: 14px 34px; text-decoration: none; border-radius: 14px; font-size: 14px; font-weight: 900; display: inline-block; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); letter-spacing: 0.4px;">
              ${ctaText} &rarr;
            </a>
          </div>
        ` : ''}
      </div>

      <div class="bg-footer border-theme" style="padding: 22px 20px; background-color: #06080d; border-top: 1px solid #1e293b; text-align: center; box-sizing: border-box;">
        <p class="text-muted" style="margin: 0 0 8px 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
          ${footerNote || 'This is an important verified notification regarding your Weblets account & web development services.'}
        </p>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; line-height: 1.6;">
          <span>📍 <strong>WEBLETS Studio</strong> &bull; Rathtala, Burdwan, West Bengal - 713102, India</span><br />
          <span>✉️ Support: <a href="mailto:${supportEmail}" style="color: #a855f7; text-decoration: none; font-weight: 700;">${supportEmail}</a> &bull; 🌐 <a href="${clientUrl}" style="color: #a855f7; text-decoration: none; font-weight: 700;">weblets.bond</a></span>
        </div>
        <p class="text-muted" style="margin: 0; font-size: 10px; color: #64748b; font-weight: 500;">
          &copy; ${currentYear} WEBLETS. All rights reserved. &bull; <a href="${clientUrl}/dashboard?tab=profile" style="color: #a855f7; text-decoration: underline;">Notification Preferences</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// Universal Helper to Resolve Actual Client Email across diverse schemas
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
      if (clean.includes('@') && !clean.includes('example.com')) {
        return clean;
      }
    }
  }

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
  if (cleanRaw.includes('@')) return cleanRaw;
  return '';
};

// ==========================================
// 1. Welcome Email (on Registration)
// ==========================================
export const sendWelcomeEmail = async (user) => {
  const clientUrl = getClientUrl();
  const subject = `Welcome to WEBLETS, ${user.name}!`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${user.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Welcome to <strong>WEBLETS</strong> — Lets make website together! Your client account is now set up. You can explore modern website packages, submit custom design requirements, track milestones in real-time, and get instant founder callbacks.
      </p>
      <div class="bg-box border-theme" style="background-color: #131b2e; border-radius: 12px; padding: 14px 16px; border: 1px solid #1e293b; margin-top: 14px; box-sizing: border-box;">
        <div class="text-muted" style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Registered Email:</div>
        <div style="font-size: 14px; color: #a855f7; font-weight: 800; font-family: monospace; word-break: break-all;">${user.email}</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Welcome to WEBLETS — Your digital development console is ready.`,
    headerBadge: 'CLIENT PORTAL READY',
    title: `Welcome aboard, ${user.name}!`,
    subtitle: `Your client portal is ready for fast website launches & custom engineering.`,
    contentHtml,
    ctaText: 'Access My Client Dashboard',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `Welcome to WEBLETS, ${user.name}!` });
};

// ==========================================
// 2. Email Verification OTP Email
// ==========================================
export const sendVerificationOtpEmail = async ({ user, otp, email }) => {
  const targetEmail = email || user?.email;
  const userName = user?.name || 'Valued Client';
  const subject = `Your WEBLETS Verification Code: ${otp}`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hello ${userName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Please use the 6-digit verification code below to activate your <strong>WEBLETS</strong> account:
      </p>

      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #7c3aed; border-radius: 14px; padding: 20px; margin: 18px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #c084fc; text-transform: uppercase; font-weight: 800; margin-bottom: 6px; letter-spacing: 1px;">6-Digit Verification Code (OTP)</div>
        <div style="font-size: 32px; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 6px;">${otp}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">Valid for 15 minutes. Never share this code with anyone.</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your verification code is ${otp}. Valid for 15 minutes.`,
    headerBadge: 'SECURITY VERIFICATION',
    title: 'Verify Your Email Address',
    subtitle: 'Enter this 6-digit code to activate your account.',
    contentHtml,
  });

  return await sendEmail({ to: targetEmail, subject, html, text: `Your WEBLETS verification code is: ${otp}` });
};

// ==========================================
// 3. Password Reset OTP Email (Forgot Password)
// ==========================================
export const sendPasswordResetOtpEmail = async ({ user, otp, email }) => {
  const targetEmail = email || user?.email;
  const userName = user?.name || 'User';
  const clientUrl = getClientUrl();
  const subject = `Reset Your WEBLETS Password — Code: ${otp}`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hello ${userName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        We received a request to reset the password for your WEBLETS account (<strong>${targetEmail}</strong>). Please use the security code below to complete your password reset:
      </p>

      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #ec4899; border-radius: 14px; padding: 20px; margin: 18px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #f472b6; text-transform: uppercase; font-weight: 800; margin-bottom: 6px; letter-spacing: 1px;">Password Reset Code</div>
        <div style="font-size: 32px; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 6px;">${otp}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">Valid for 15 minutes. If you did not request this, please ignore this email.</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your password reset code is ${otp}. Valid for 15 minutes.`,
    headerBadge: 'PASSWORD RESET REQUEST',
    title: 'Reset Account Password',
    subtitle: 'Use this security code to choose a new password.',
    contentHtml,
    ctaText: 'Reset Password Now',
    ctaUrl: `${clientUrl}/forgot-password?email=${encodeURIComponent(targetEmail)}&code=${otp}`,
  });

  return await sendEmail({ to: targetEmail, subject, html, text: `Your WEBLETS password reset code is: ${otp}` });
};

// ==========================================
// 4. Password Reset Success Email
// ==========================================
export const sendPasswordResetSuccessEmail = async ({ user }) => {
  const clientUrl = getClientUrl();
  const subject = `Your WEBLETS Password Has Been Updated`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hello ${user.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        This email confirms that the password for your WEBLETS account (<strong>${user.email}</strong>) was successfully changed.
      </p>
      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1px solid #10b981; border-radius: 12px; padding: 14px 16px; margin-top: 14px; box-sizing: border-box;">
        <div style="font-size: 12px; color: #34d399; font-weight: 700;">✅ Security Status: Password Changed Successfully</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">If you did not make this change, please contact support immediately at contact@weblets.bond</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your WEBLETS account password has been successfully reset.`,
    headerBadge: 'SECURITY NOTIFICATION',
    title: 'Password Changed Successfully',
    subtitle: 'Your account credentials have been updated.',
    contentHtml,
    ctaText: 'Sign In to Your Account',
    ctaUrl: `${clientUrl}/login`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `Your WEBLETS password was changed successfully.` });
};

// ==========================================
// 5. Requirement / Order Submitted Email (to Client)
// ==========================================
export const sendRequirementConfirmationEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const businessName = reqDoc.clientInfo?.businessName || reqDoc.websiteTypeName || reqDoc.businessName || 'Your Website';
  const websiteType = reqDoc.websiteTypeName || reqDoc.websiteType || 'Custom Website';
  const clientEmail = resolveClientEmail(reqDoc);

  if (!clientEmail) {
    console.warn(`sendRequirementConfirmationEmail notice: No client email found for ${reqId}`);
    return { success: false, error: 'No client email provided' };
  }

  const subject = `Order Confirmed: ${businessName} (#${reqId}) - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        We have received your website specifications for <strong>${businessName}</strong>. Our UI designers and full-stack engineers have queued your project for sprint planning.
      </p>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 16px 0; background-color: #131b2e; border-radius: 14px; overflow: hidden; border: 1px solid #1e293b; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; width: 36%; font-size: 12px; font-weight: 600; vertical-align: top;">Order / Req ID:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #a855f7; font-family: monospace; font-size: 14px; width: 64%; vertical-align: top;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Business Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #ffffff; font-size: 13px; vertical-align: top; word-break: break-word;">${businessName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Category:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #ffffff; font-size: 13px; vertical-align: top; word-break: break-word;">${websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Delivery Timeline:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #06b6d4; font-size: 13px; vertical-align: top;">${reqDoc.timeline || 'Express (48 - 72 Hours)'}</td>
        </tr>
        <tr>
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Current Status:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #a855f7; font-size: 13px; vertical-align: top;">Submitted &bull; Under Engineering Review</td>
        </tr>
      </table>

      <div style="background-color: #1e1b4b; border: 1px solid #4338ca; border-radius: 12px; padding: 12px 16px; margin: 14px 0;">
        <p style="margin: 0; font-size: 12px; color: #c7d2fe; font-weight: 600; line-height: 1.5;">
          📍 <strong>Live Order Tracking:</strong> You can track sprint progress and download delivery files anytime using Order ID <strong>${reqId}</strong>.
        </p>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Order ${reqId} confirmed for ${businessName}. Live tracking active.`,
    headerBadge: 'WEBSITE ORDER INITIALIZED',
    title: `Website Order Confirmed`,
    subtitle: `We have logged your specifications and begun architecture planning.`,
    orderId: reqId,
    contentHtml,
    ctaText: `Track Order ${reqId} Online`,
    ctaUrl: `${clientUrl}/track-order?id=${reqId}`,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Requirements confirmed for ${businessName} (${reqId})` });
};

// ==========================================
// 6. Admin Notification on New Requirement Submission
// ==========================================
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
      <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); color: #fcd34d; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; margin-bottom: 12px;">
        NEW CLIENT SPECIFICATION &amp; ORDER SUBMISSION
      </div>

      <table class="bg-box border-theme" style="width: 100% !important; max-width: 100%; table-layout: fixed; border-collapse: collapse; background-color: #131b2e; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; box-sizing: border-box;">
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; width: 34%; font-size: 12px; font-weight: 600; vertical-align: top;">Requirement ID:</td>
          <td style="padding: 11px 12px; font-weight: 900; color: #a855f7; font-family: monospace; font-size: 14px; width: 66%; vertical-align: top;">${reqId}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Client Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 800; color: #ffffff; font-size: 13px; vertical-align: top; word-break: break-word;">${clientName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #34d399; font-family: monospace; font-size: 14px; vertical-align: top; word-break: break-all;">
            <a href="tel:${phone}" style="color: #34d399; text-decoration: none;">${phone}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Email:</td>
          <td style="padding: 11px 12px; font-weight: 700; color: #38bdf8; font-size: 13px; vertical-align: top; word-break: break-all;">
            <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Business Name:</td>
          <td class="text-title" style="padding: 11px 12px; font-weight: 700; color: #ffffff; font-size: 13px; vertical-align: top; word-break: break-word;">${businessName}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Website Type:</td>
          <td class="text-body" style="padding: 11px 12px; color: #cbd5e1; font-weight: 600; font-size: 13px; vertical-align: top; word-break: break-word;">${websiteType}</td>
        </tr>
        <tr class="border-theme" style="border-bottom: 1px solid #1e293b;">
          <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Budget &amp; Timeline:</td>
          <td style="padding: 11px 12px; font-weight: 800; color: #f59e0b; font-size: 13px; vertical-align: top;">${reqDoc.budget || 'Standard'} &bull; ${reqDoc.timeline || 'Express'}</td>
        </tr>
        ${reqDoc.additionalNotes ? `
          <tr>
            <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-weight: 600; vertical-align: top;">Notes:</td>
            <td class="text-muted" style="padding: 11px 12px; color: #94a3b8; font-size: 12px; font-style: italic; vertical-align: top; word-break: break-word;">${reqDoc.additionalNotes}</td>
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

// ==========================================
// 7. Requirement Status & Quote Update Email (to Client)
// ==========================================
export const sendRequirementStatusUpdateEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || reqDoc.fullName || reqDoc.name || 'Valued Client';
  const clientEmail = resolveClientEmail(reqDoc);
  const status = reqDoc.status || 'Updated';
  const formattedStatus = formatStatusTitle(status);
  const pdfUrl = reqDoc.drivePdfLink || reqDoc.pdfUrl || reqDoc.documentUrl || reqDoc.attachmentUrl;
  const adminRecipients = getAdminRecipients();
  const allRecipients = Array.from(new Set([clientEmail, ...adminRecipients].filter(Boolean)));

  if (allRecipients.length === 0) {
    return { success: false, error: 'No recipient email addresses found' };
  }

  const subject = `Order Status Update: ${formattedStatus} - ${reqDoc.clientInfo?.businessName || 'Website Order'} (#${reqId})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        The development progress for website order <strong>${reqId}</strong> (${reqDoc.clientInfo?.businessName || 'Project'}) has been updated:
      </p>

      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #10b981; border-radius: 14px; padding: 18px 22px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #34d399; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">Current Milestone Status</div>
        <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">${formattedStatus}</div>
      </div>

      ${reqDoc.quotedAmount ? `
        <div class="bg-box border-theme" style="background-color: #131b2e; border: 1px solid #f59e0b; border-radius: 12px; padding: 14px 18px; margin: 14px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; color: #fbbf24; text-transform: uppercase; font-weight: 800; margin-bottom: 2px;">Official Quoted Investment</div>
          <div style="font-size: 18px; font-weight: 900; color: #ffffff;">${reqDoc.quotedAmount}</div>
        </div>
      ` : ''}

      ${pdfUrl ? `
        <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #6366f1; border-radius: 14px; padding: 16px; margin: 16px 0; text-align: center; box-sizing: border-box;">
          <div style="font-size: 11px; font-weight: 800; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            📄 Official Project Document / Proposal Attached
          </div>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #cbd5e1;">
            Our team has attached the official project quotation PDF for your review:
          </p>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 10px 22px; font-size: 13px; font-weight: 800; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">
            Open / Download PDF Document
          </a>
        </div>
      ` : ''}

      ${reqDoc.internalNotes ? `
        <div class="bg-box border-theme" style="background-color: #131b2e; border-radius: 12px; padding: 12px 16px; border: 1px solid #1e293b; margin-top: 14px; box-sizing: border-box;">
          <div class="text-muted" style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Engineer Notes:</div>
          <div class="text-body" style="font-size: 13px; color: #cbd5e1; word-break: break-word;">${reqDoc.internalNotes}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your website order ${reqId} is now ${formattedStatus}. Track progress online.`,
    headerBadge: 'PROJECT MILESTONE UPDATE',
    title: `Order Status: ${formattedStatus}`,
    subtitle: `Current Phase: ${formattedStatus} &bull; Order ID: ${reqId}`,
    orderId: reqId,
    contentHtml,
    ctaText: `Track Order ${reqId} Live`,
    ctaUrl: `${clientUrl}/track-order?id=${reqId}`,
  });

  return await sendEmail({
    to: allRecipients,
    subject,
    html,
    text: `Your order ${reqId} status is now ${formattedStatus}`,
    isImportant: true,
    priority: 'high',
  });
};

// ==========================================
// 8. Order Delivered Email
// ==========================================
export const sendOrderDeliveredEmail = async (reqDoc) => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || 'Valued Client';
  const clientEmail = resolveClientEmail(reqDoc);
  const adminRecipients = getAdminRecipients();
  const allRecipients = Array.from(new Set([clientEmail, ...adminRecipients].filter(Boolean)));

  if (allRecipients.length === 0) return { success: false };

  const subject = `🎉 Project Delivered: ${reqDoc.clientInfo?.businessName || 'Your Website'} (#${reqId}) - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Congratulations ${clientName}!
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Your website project (<strong>${reqId}</strong>) has been successfully finalized and delivered! You can access all delivery assets, source files, and live links directly from your portal.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Project ${reqId} has been successfully completed and delivered!`,
    headerBadge: 'PROJECT DELIVERED',
    title: 'Your Website is Ready!',
    subtitle: `Order: ${reqId} has been completed.`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Access Project Files',
    ctaUrl: `${clientUrl}/track-order?id=${reqId}`,
  });

  return await sendEmail({ to: allRecipients, subject, html, text: `Project ${reqId} has been delivered!` });
};

// ==========================================
// 8b. Requirement Rejected / Cancelled Email
// ==========================================
export const sendRequirementRejectedEmail = async (reqDoc, reason = '') => {
  const clientUrl = getClientUrl();
  const reqId = reqDoc.requirementId || `REQ-${Date.now().toString().slice(-6)}`;
  const clientName = reqDoc.clientInfo?.ownerName || reqDoc.clientInfo?.contactPerson || 'Valued Client';
  const clientEmail = resolveClientEmail(reqDoc);
  const adminRecipients = getAdminRecipients();
  const allRecipients = Array.from(new Set([clientEmail, ...adminRecipients].filter(Boolean)));

  if (allRecipients.length === 0) return { success: false };

  const subject = `Order Notice: Cancelled / Closed (#${reqId}) - WEBLETS`;
  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${clientName},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Your project submission (<strong>${reqId}</strong>) status has been updated to <strong>Cancelled / Closed</strong>.
      </p>
      ${reason ? `
        <div class="bg-box" style="background-color: #2a1215; border: 1px solid #e11d48; border-radius: 12px; padding: 14px; margin: 14px 0; color: #fecdd3;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #fb7185; margin-bottom: 4px;">Reason / Notes:</div>
          <div style="font-size: 13px;">${reason}</div>
        </div>
      ` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Order ${reqId} status update.`,
    headerBadge: 'ORDER STATUS UPDATE',
    title: `Order: Cancelled / Closed`,
    subtitle: `Order ID: ${reqId}`,
    orderId: reqId,
    contentHtml,
    ctaText: 'Visit Client Hub',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: allRecipients, subject, html, text: `Order ${reqId} cancelled: ${reason}` });
};

// ==========================================
// 9. Callback Request Confirmation & Status Update Emails
// ==========================================
export const sendCallbackConfirmationEmail = async (callback) => {
  const clientUrl = getClientUrl();
  const clientEmail = resolveClientEmail(callback);
  if (!clientEmail) return { success: false };

  const subject = `Callback Scheduled: Founder Call Desk - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${callback.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        We have received your instant callback request for phone <strong>${callback.phone || 'N/A'}</strong>. Our engineering founder desk will reach out to you shortly.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Weblets Callback requested for ${callback.name || 'Client'}.`,
    headerBadge: 'FOUNDER CALLBACK DESK',
    title: 'Callback Request Received',
    subtitle: 'Our technical director will contact you directly.',
    contentHtml,
    ctaText: 'Open WEBLETS Studio',
    ctaUrl: clientUrl,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Callback request received for ${callback.name}` });
};

export const sendAdminCallbackAlert = async (callback) => {
  const recipients = getAdminRecipients();
  const subject = `⚡ Instant Callback Request: ${callback.name} (${callback.phone})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Client Callback Request:
      </p>
      <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8;">
        <li><strong>Name:</strong> ${callback.name}</li>
        <li><strong>Phone:</strong> <a href="tel:${callback.phone}" style="color: #34d399; font-weight: 800;">${callback.phone}</a></li>
        <li><strong>Email:</strong> ${callback.email || 'N/A'}</li>
        <li><strong>Time Slot:</strong> ${callback.preferredTime || 'Immediate'}</li>
        <li><strong>Notes:</strong> ${callback.notes || callback.message || 'N/A'}</li>
      </ul>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Instant callback requested by ${callback.name} (${callback.phone}).`,
    headerBadge: 'ADMIN INSTANT ALERT',
    title: 'New Callback Request',
    subtitle: `${callback.name} &bull; ${callback.phone}`,
    contentHtml,
    ctaText: 'View in Admin Panel',
    ctaUrl: `${getClientUrl()}/admin/callbacks`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `Callback request from ${callback.name} (${callback.phone})`, priority: 'high' });
};

export const sendCallbackStatusUpdateEmail = async (callback, newStatus = '', customNotes = '') => {
  const clientEmail = resolveClientEmail(callback);
  const adminRecipients = getAdminRecipients();
  const allRecipients = Array.from(new Set([clientEmail, ...adminRecipients].filter(Boolean)));
  if (allRecipients.length === 0) return { success: false };

  const formattedStatus = formatStatusTitle(newStatus || callback.status);
  const subject = `Callback Update: ${formattedStatus} - ${callback.name || 'Client'} (${callback.phone || ''}) - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${callback.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        The callback request for <strong>${callback.name}</strong> (${callback.phone}) has been updated to: <strong>${formattedStatus}</strong>.
      </p>
      ${customNotes ? `<p style="color: #94a3b8; font-size: 13px; font-style: italic;">Notes: ${customNotes}</p>` : ''}
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Callback request status is now ${formattedStatus}.`,
    headerBadge: 'CALLBACK STATUS UPDATE',
    title: `Callback Status: ${formattedStatus}`,
    subtitle: `${callback.name} &bull; ${callback.phone}`,
    contentHtml,
    ctaText: 'Open Callbacks',
    ctaUrl: `${getClientUrl()}/admin/callbacks`,
  });

  return await sendEmail({ to: allRecipients, subject, html, text: `Callback status: ${formattedStatus}` });
};

export const sendCallbackResolutionEmail = async (callback) => {
  return await sendCallbackStatusUpdateEmail(callback, 'Resolved', 'Your callback inquiry has been successfully concluded. Thank you for connecting with Weblets!');
};

// ==========================================
// 10. Leads & Queries Confirmation & Status Emails
// ==========================================
export const sendLeadConfirmationEmail = async (lead) => {
  const clientEmail = resolveClientEmail(lead);
  if (!clientEmail) return { success: false };

  const subject = `Inquiry Received: Weblets Web Studio`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${lead.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Thank you for contacting WEBLETS. We have received your message regarding <strong>${lead.subject || lead.businessName || 'Web Project'}</strong>. A dedicated project strategist will review your query and reply within 2-4 hours.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Thank you for contacting WEBLETS. We have logged your query.`,
    headerBadge: 'INQUIRY LOGGED',
    title: 'Message Received',
    subtitle: 'Our project desk is reviewing your requirements.',
    contentHtml,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Thank you for contacting WEBLETS, ${lead.name}` });
};

export const sendAdminNewLeadAlert = async (lead) => {
  const recipients = getAdminRecipients();
  const subject = `📩 New Inquiry: ${lead.name} (${lead.phone || lead.email})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8;">
        <li><strong>Name:</strong> ${lead.name}</li>
        <li><strong>Email:</strong> ${lead.email}</li>
        <li><strong>Phone:</strong> ${lead.phone || 'N/A'}</li>
        <li><strong>Subject:</strong> ${lead.subject || 'Website Inquiry'}</li>
        <li><strong>Message:</strong> ${lead.message || 'N/A'}</li>
      </ul>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New lead received from ${lead.name}.`,
    headerBadge: 'ADMIN INQUIRY ALERT',
    title: 'New Client Inquiry',
    subtitle: `${lead.name} &bull; ${lead.email}`,
    contentHtml,
    ctaText: 'Open Leads in Admin',
    ctaUrl: `${getClientUrl()}/admin/queries`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New lead from ${lead.name}` });
};

export const sendLeadStatusUpdateEmail = async (lead) => {
  const clientEmail = resolveClientEmail(lead);
  const adminRecipients = getAdminRecipients();
  const allRecipients = Array.from(new Set([clientEmail, ...adminRecipients].filter(Boolean)));
  if (allRecipients.length === 0) return { success: false };

  const formattedStatus = formatStatusTitle(lead.status || 'Updated');
  const subject = `Inquiry Update: ${formattedStatus} - ${lead.name || 'Client'} - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${lead.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        The inquiry regarding <strong>${lead.subject || 'Website Inquiry'}</strong> has been marked as <strong>${formattedStatus}</strong>.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Inquiry status update: ${formattedStatus}`,
    headerBadge: 'INQUIRY UPDATE',
    title: `Status: ${formattedStatus}`,
    contentHtml,
    ctaText: 'View in Admin',
    ctaUrl: `${getClientUrl()}/admin/queries`,
  });

  return await sendEmail({ to: allRecipients, subject, html, text: `Inquiry update: ${formattedStatus}` });
};

export const sendContactFormConfirmationEmail = sendLeadConfirmationEmail;

// ==========================================
// 11. Admin Alerts (New User, Reviews, etc.)
// ==========================================
export const sendAdminNewUserAlertEmail = async ({ user }) => {
  const recipients = getAdminRecipients();
  const subject = `👤 New User Registered: ${user.name} (${user.email})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8;">
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Phone:</strong> ${user.phone || 'N/A'}</li>
        <li><strong>Company:</strong> ${user.company || 'N/A'}</li>
      </ul>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New user ${user.name} registered.`,
    headerBadge: 'NEW USER REGISTERED',
    title: 'New Account Created',
    subtitle: `${user.name} (${user.email})`,
    contentHtml,
    ctaText: 'View Users in Admin',
    ctaUrl: `${getClientUrl()}/admin/users`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New user: ${user.name} (${user.email})` });
};

export const sendGameRewardWinEmail = async ({ user, prize }) => {
  const clientUrl = getClientUrl();
  const subject = `🎁 You Won: ${prize.label || 'Launch Reward'} - WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Congratulations ${user.name || 'Lucky Winner'}!
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        You have unlocked an exclusive launch reward: <strong>${prize.label}</strong>! Use the discount voucher code below when ordering any website package:
      </p>

      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #a855f7; border-radius: 14px; padding: 18px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #c084fc; text-transform: uppercase; font-weight: 800; margin-bottom: 4px;">Exclusive Promo Voucher Code</div>
        <div style="font-size: 26px; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 3px;">${prize.code || 'WEBLETS20'}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">${prize.subLabel || 'Apply during checkout for instant savings'}</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your prize code is ${prize.code || 'WEBLETS20'}.`,
    headerBadge: 'LAUNCH PRIZE UNLOCKED',
    title: 'Reward Voucher Won!',
    subtitle: `${prize.label}`,
    contentHtml,
    ctaText: 'Claim & Start Project',
    ctaUrl: `${clientUrl}/pricing?coupon=${prize.code || 'WEBLETS20'}`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `You won prize ${prize.code}` });
};

export const sendVipWhatsappActivatedEmail = async ({ user }) => {
  const clientUrl = getClientUrl();
  const subject = `💎 VIP Direct WhatsApp Priority Access Activated — WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hello ${user.name},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        You have unlocked <strong>VIP Direct WhatsApp Priority Support</strong>. You can now message our lead engineering desk directly 1-on-1 for fast-track website updates and sprint delivery support.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `VIP WhatsApp support is now active on your account.`,
    headerBadge: 'VIP FEATURE UNLOCKED',
    title: 'Direct WhatsApp Support Active',
    contentHtml,
    ctaText: 'Open My Dashboard',
    ctaUrl: `${clientUrl}/dashboard`,
  });

  return await sendEmail({ to: user.email, subject, html, text: `VIP WhatsApp support active` });
};

export const sendAdminNewReviewEmail = async ({ review, user }) => {
  const recipients = getAdminRecipients();
  const subject = `⭐ New Review Submitted by ${review.name || user?.name} (${review.rating || 5} Stars)`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p style="color: #cbd5e1; font-size: 13px;"><strong>Rating:</strong> ${review.rating} / 5 ⭐</p>
      <p style="color: #cbd5e1; font-size: 13px;"><strong>Review:</strong> "${review.comment || review.feedback}"</p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `New review submitted (${review.rating} stars).`,
    headerBadge: 'NEW CLIENT REVIEW',
    title: 'New Review Submitted',
    contentHtml,
    ctaText: 'Manage Reviews in Admin',
    ctaUrl: `${getClientUrl()}/admin/reviews`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `New review from ${review.name}` });
};

export const sendReviewSubmittedClientEmail = async ({ review, user }) => {
  const clientEmail = resolveClientEmail(review) || user?.email;
  if (!clientEmail) return { success: false };

  const subject = `Thank You for Your Feedback — WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hi ${review.name || user?.name || 'Valued Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Thank you for submitting your review of WEBLETS. Your feedback helps us continuously elevate our web engineering standards.
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Thank you for reviewing WEBLETS.`,
    headerBadge: 'FEEDBACK RECEIVED',
    title: 'Thank You for Your Review!',
    contentHtml,
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Thank you for your review!` });
};

export const sendReviewApprovedClientEmail = async ({ review }) => {
  const clientEmail = resolveClientEmail(review);
  if (!clientEmail) return { success: false };

  const subject = `🎉 Your Review is Now Live on WEBLETS!`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Your testimonial has been verified and published on our official website portfolio & testimonials showcase!
      </p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your review is now published on weblets.bond`,
    headerBadge: 'REVIEW PUBLISHED',
    title: 'Your Review is Live!',
    contentHtml,
    ctaText: 'View Live Showcase',
    ctaUrl: getClientUrl('/portfolio'),
  });

  return await sendEmail({ to: clientEmail, subject, html, text: `Your review is live!` });
};

export const sendEmailChangeOtpEmail = async ({ to, userName, otp }) => {
  const subject = `Security Code for Email Address Change — WEBLETS`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p class="text-title" style="margin: 0 0 12px 0; color: #ffffff; font-size: 15px; font-weight: 700;">
        Hello ${userName || 'Client'},
      </p>
      <p class="text-body" style="margin: 0 0 14px 0; color: #cbd5e1; line-height: 1.6;">
        Please enter the 6-digit confirmation code below to verify and complete your new registered email address:
      </p>

      <div class="bg-box border-theme" style="background-color: #131b2e; border: 1.5px solid #a855f7; border-radius: 14px; padding: 18px; margin: 16px 0; text-align: center; box-sizing: border-box;">
        <div style="font-size: 11px; color: #c084fc; text-transform: uppercase; font-weight: 800; margin-bottom: 4px;">6-Digit OTP Code</div>
        <div style="font-size: 28px; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 4px;">${otp}</div>
      </div>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `Your email change verification code is ${otp}.`,
    headerBadge: 'EMAIL CHANGE VERIFICATION',
    title: 'Verify New Email Address',
    contentHtml,
  });

  return await sendEmail({ to, subject, html, text: `Email change code: ${otp}` });
};

export const sendAdminUserEmailChangedEmail = async ({ user, oldEmail, newEmail }) => {
  const recipients = getAdminRecipients();
  const subject = `🔔 User Email Changed: ${user.name} (${oldEmail} -> ${newEmail})`;

  const contentHtml = `
    <div style="margin: 10px 0 16px 0;">
      <p style="color: #cbd5e1; font-size: 13px;">User <strong>${user.name}</strong> has updated their email address.</p>
      <p style="color: #cbd5e1; font-size: 13px;">Old Email: ${oldEmail}<br />New Email: ${newEmail}</p>
    </div>
  `;

  const html = wrapAgencyEmail({
    preheader: `User email updated to ${newEmail}`,
    headerBadge: 'ADMIN SECURITY ALERT',
    title: 'User Email Updated',
    contentHtml,
    ctaText: 'View Users in Admin',
    ctaUrl: `${getClientUrl()}/admin/users`,
  });

  return await sendEmail({ to: recipients, subject, html, text: `User ${user.name} changed email` });
};

// Deletion & Rejection Alerts
export const sendRequirementDeletionEmail = async (reqDoc, reason = '') => {
  const clientEmail = resolveClientEmail(reqDoc);
  if (!clientEmail) return { success: false };
  const reqId = reqDoc.requirementId || 'REQ';

  const html = wrapAgencyEmail({
    preheader: `Order ${reqId} has been archived.`,
    headerBadge: 'ORDER ARCHIVED',
    title: `Order ${reqId} Removed`,
    contentHtml: `<p style="color: #cbd5e1;">Your order specifications for ${reqDoc.clientInfo?.businessName || 'your website'} have been archived.${reason ? ` Reason: ${reason}` : ''}</p>`,
  });

  return await sendEmail({ to: clientEmail, subject: `Order Archived: #${reqId} - WEBLETS`, html, text: `Order ${reqId} archived` });
};


export const sendAdminRequirementDeletionAlert = async (reqDoc, reason = '') => {
  const recipients = getAdminRecipients();
  const html = wrapAgencyEmail({
    preheader: `Order ${reqDoc.requirementId} was deleted by admin.`,
    headerBadge: 'ADMIN AUDIT',
    title: `Order Deleted: ${reqDoc.requirementId}`,
    contentHtml: `<p style="color: #cbd5e1;">Order for ${reqDoc.clientInfo?.businessName || 'Business'} was deleted.${reason ? ` Reason: ${reason}` : ''}</p>`,
  });
  return await sendEmail({ to: recipients, subject: `Order Deleted: #${reqDoc.requirementId}`, html, text: `Order deleted` });
};

export const sendCallbackDeletionEmail = async (callback) => {
  const clientEmail = resolveClientEmail(callback);
  if (!clientEmail) return { success: false };
  const html = wrapAgencyEmail({
    headerBadge: 'CALLBACK ARCHIVED',
    title: 'Callback Request Concluded',
    contentHtml: `<p style="color: #cbd5e1;">Your callback request for ${callback.phone} has been concluded.</p>`,
  });
  return await sendEmail({ to: clientEmail, subject: 'Callback Request Concluded - WEBLETS', html, text: 'Callback concluded' });
};

export const sendAdminCallbackDeletionAlert = async (callback) => {
  const recipients = getAdminRecipients();
  const html = wrapAgencyEmail({
    headerBadge: 'ADMIN AUDIT',
    title: 'Callback Record Deleted',
    contentHtml: `<p style="color: #cbd5e1;">Callback for ${callback.name} (${callback.phone}) deleted.</p>`,
  });
  return await sendEmail({ to: recipients, subject: `Callback Deleted: ${callback.name}`, html, text: `Callback deleted` });
};

export const sendServiceDeletionAlert = async (service) => {
  const recipients = getAdminRecipients();
  const html = wrapAgencyEmail({
    headerBadge: 'CATALOG UPDATE',
    title: 'Service Removed',
    contentHtml: `<p style="color: #cbd5e1;">Service package "${service.title || service.name}" was removed.</p>`,
  });
  return await sendEmail({ to: recipients, subject: `Service Removed: ${service.title}`, html, text: `Service removed` });
};

export const sendQueryDeletionEmail = async (queryDoc) => {
  const clientEmail = resolveClientEmail(queryDoc);
  if (!clientEmail) return { success: false };
  const html = wrapAgencyEmail({
    headerBadge: 'INQUIRY CLOSED',
    title: 'Inquiry Archived',
    contentHtml: `<p style="color: #cbd5e1;">Your inquiry has been archived.</p>`,
  });
  return await sendEmail({ to: clientEmail, subject: 'Inquiry Archived - WEBLETS', html, text: 'Inquiry archived' });
};

export const sendAdminQueryDeletionAlert = async (queryDoc) => {
  const recipients = getAdminRecipients();
  const html = wrapAgencyEmail({
    headerBadge: 'ADMIN AUDIT',
    title: 'Inquiry Deleted',
    contentHtml: `<p style="color: #cbd5e1;">Inquiry from ${queryDoc.name} (${queryDoc.email}) deleted.</p>`,
  });
  return await sendEmail({ to: recipients, subject: `Inquiry Deleted: ${queryDoc.name}`, html, text: `Inquiry deleted` });
};
