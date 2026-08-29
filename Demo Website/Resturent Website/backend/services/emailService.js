const nodemailer = require('nodemailer');
const db = require('../db');

// Helper to get active email & SMTP configuration
function getEmailConfig() {
  let config = {
    enable_email_notifications: process.env.ENABLE_EMAIL_NOTIFICATIONS || 'true',
    smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtp_port: parseInt(process.env.SMTP_PORT || '587', 10),
    smtp_user: process.env.SMTP_USER || '',
    smtp_pass: process.env.SMTP_PASS || '',
    smtp_from: process.env.SMTP_FROM || "L'Amour Gourmet & Grill <contact@lamourgourmet.com>",
    smtp_secure: process.env.SMTP_SECURE === 'true',
    admin_notification_email: process.env.ADMIN_EMAIL || 'admin@restaurant.com',
    restaurant_name: process.env.RESTAURANT_NAME || "L'Amour Gourmet & Grill",
    restaurant_phone: process.env.RESTAURANT_PHONE || "+91 98765 43210",
    restaurant_address: process.env.RESTAURANT_ADDRESS || "12/A Park Avenue, Gourmet Boulevard"
  };

  try {
    const rows = db.prepare("SELECT key, value FROM site_settings WHERE key IN ('enable_email_notifications', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from', 'smtp_secure', 'admin_notification_email', 'restaurant_name', 'phone', 'address')").all();
    rows.forEach(r => {
      if (r.key === 'enable_email_notifications') config.enable_email_notifications = r.value;
      if (r.key === 'smtp_host' && r.value) config.smtp_host = r.value.trim();
      if (r.key === 'smtp_port' && r.value) config.smtp_port = parseInt(r.value, 10);
      if (r.key === 'smtp_user' && r.value) config.smtp_user = r.value.trim();
      if (r.key === 'smtp_pass' && r.value) config.smtp_pass = r.value.trim();
      if (r.key === 'smtp_from' && r.value) config.smtp_from = r.value.trim();
      if (r.key === 'smtp_secure') config.smtp_secure = r.value === 'true';
      if (r.key === 'admin_notification_email' && r.value) config.admin_notification_email = r.value.trim();
      if (r.key === 'restaurant_name' && r.value) config.restaurant_name = r.value;
      if (r.key === 'phone' && r.value) config.restaurant_phone = r.value;
      if (r.key === 'address' && r.value) config.restaurant_address = r.value;
    });
  } catch (err) {
    // Rely on defaults
  }

  const isConfigured = Boolean(config.smtp_user && config.smtp_pass);

  return { config, isConfigured };
}

// Create nodemailer transporter
function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: config.smtp_secure || config.smtp_port === 465,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Master Send Email Function with Simulation Fallback
async function sendMail({ to, subject, html, text }) {
  const { config, isConfigured } = getEmailConfig();

  if (config.enable_email_notifications === 'false') {
    console.log(`🔕 Email notifications disabled. Skipping email to: ${to}`);
    return { success: false, reason: 'disabled' };
  }

  if (!to || !to.includes('@')) {
    console.warn(`⚠️ Invalid recipient email: ${to}`);
    return { success: false, reason: 'invalid_email' };
  }

  // If live SMTP credentials are configured
  if (isConfigured) {
    try {
      const transporter = createTransporter(config);
      const info = await transporter.sendMail({
        from: config.smtp_from,
        to,
        subject,
        text: text || subject,
        html
      });
      console.log(`📧 Live Email sent to ${to} [MessageId: ${info.messageId}]`);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (err) {
      console.error(`❌ SMTP delivery failed to ${to}:`, err.message);
      // Log simulation below as fallback
    }
  }

  // Simulation mode (Logs formatted preview to console without throwing errors)
  console.log(`\n======================================================`);
  console.log(`📨 [SIMULATED EMAIL DISPATCH] (Configure SMTP in Admin to send live)`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From: ${config.smtp_from}`);
  console.log(`======================================================\n`);

  return { success: true, simulated: true, to, subject };
}

// Luxury HTML Email Template Wrapper
function buildEmailTemplate({ title, subtitle, badge, contentHtml, actionButton }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f0c0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F3E9D8; }
    .container { max-width: 600px; margin: 20px auto; background-color: #171310; border: 1px solid rgba(169, 134, 90, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
    .header { background-color: #0f0c0a; padding: 28px 30px; text-align: center; border-bottom: 1px solid rgba(169, 134, 90, 0.2); }
    .logo { font-size: 26px; font-weight: bold; color: #F3E9D8; letter-spacing: -0.5px; margin: 0; }
    .logo-sub { font-size: 10px; color: #A9865A; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; font-family: monospace; }
    .body { padding: 32px 30px; line-height: 1.6; }
    .badge { display: inline-block; background-color: rgba(216, 99, 44, 0.15); border: 1px solid #D8632C; color: #E8AC4E; font-size: 11px; font-family: monospace; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
    .title { font-size: 22px; font-weight: bold; color: #F3E9D8; margin: 0 0 8px 0; }
    .subtitle { font-size: 14px; color: #D6C8B2; margin: 0 0 24px 0; }
    .card { background-color: #231d19; border: 1px solid rgba(169, 134, 90, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 13px; }
    .btn { display: inline-block; background-color: #D8632C; color: #171310 !important; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 30px; text-align: center; margin-top: 10px; }
    .btn:hover { background-color: #e37440; }
    .footer { background-color: #0f0c0a; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(169, 134, 90, 0.15); font-size: 11px; color: #A9865A; font-family: monospace; }
    .footer a { color: #E8AC4E; text-decoration: none; }
    .ticket-mono { font-family: monospace; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { text-align: left; color: #A9865A; font-size: 11px; text-transform: uppercase; padding-bottom: 8px; border-bottom: 1px solid rgba(169,134,90,0.2); font-family: monospace; }
    td { padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(169,134,90,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔥 L'Amour</div>
      <div class="logo-sub">Gourmet & Charcoal Grill</div>
    </div>
    <div class="body">
      ${badge ? `<div class="badge">${badge}</div>` : ''}
      <h1 class="title">${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      ${contentHtml}
      ${actionButton ? `<div style="text-align: center; margin: 25px 0 10px 0;"><a href="${actionButton.url}" class="btn">${actionButton.text}</a></div>` : ''}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>L'Amour Gourmet & Grill</strong> • Charcoal & Clay Oven Heritage</p>
      <p style="margin: 0 0 6px 0;">Park Avenue, Gourmet Boulevard • Hotline: +91 98765 43210</p>
      <p style="margin: 0; color: #665544;">© ${new Date().getFullYear()} L'Amour Restaurant. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// -------------------------------------------------------------
// INDIVIDUAL EMAIL NOTIFICATION TEMPLATES & TRIGGERS
// -------------------------------------------------------------

const emailService = {
  sendMail,

  // 1. Welcome New Registration Email
  sendWelcomeEmail: async (user) => {
    const html = buildEmailTemplate({
      badge: 'WELCOME TO THE HERITAGE TABLE',
      title: `Welcome, ${user.name}!`,
      subtitle: 'Your L\'Amour Gourmet account is now active and ready.',
      contentHtml: `
        <div class="card">
          <p style="margin-top: 0;">We are delighted to have you with us. Enjoy authentic fruitwood-smoked charcoal grills, 24-hour slow-dum handis, and express 30-minute hot delivery.</p>
          <div style="background-color: #171310; border: 1px dashed #E8AC4E; padding: 14px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 11px; color: #A9865A; font-family: monospace; display: block; margin-bottom: 4px;">YOUR WELCOME VOUCHER</span>
            <strong style="font-size: 18px; color: #E8AC4E; letter-spacing: 2px; font-family: monospace;">WELCOME50</strong>
            <span style="font-size: 12px; color: #92b584; display: block; margin-top: 4px;">(15% OFF on your first order)</span>
          </div>
          <p style="margin-bottom: 0; font-size: 12px; color: #D6C8B2;">Account Email: <strong>${user.email}</strong></p>
        </div>
      `,
      actionButton: {
        text: 'Explore Charcoal Menu',
        url: 'http://localhost:5173/#menu'
      }
    });

    return sendMail({
      to: user.email,
      subject: `🔥 Welcome to L'Amour Gourmet, ${user.name}! (15% Off Inside)`,
      html
    });
  },

  // 2. Login Security Alert Email
  sendLoginAlertEmail: async (user, meta = {}) => {
    const timeStr = new Date().toLocaleString();
    const html = buildEmailTemplate({
      badge: 'SECURITY NOTIFICATION',
      title: 'New Account Sign-In',
      subtitle: `Your account was just accessed on ${timeStr}.`,
      contentHtml: `
        <div class="card">
          <p style="margin-top: 0;">Hello <strong>${user.name}</strong>,</p>
          <p>We detected a new login to your L'Amour Gourmet account.</p>
          <ul style="padding-left: 20px; margin: 12px 0; color: #D6C8B2; font-family: monospace; font-size: 12px;">
            <li><strong>Time:</strong> ${timeStr}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>IP Address:</strong> ${meta.ip || 'Local / Web Client'}</li>
          </ul>
          <p style="font-size: 12px; color: #A9865A; margin-bottom: 0;">If this was you, no action is needed. If you did not initiate this login, please reset your password immediately.</p>
        </div>
      `,
      actionButton: {
        text: 'Review Account',
        url: 'http://localhost:5173'
      }
    });

    return sendMail({
      to: user.email,
      subject: `🔒 Security Alert: Sign-In to L'Amour Gourmet`,
      html
    });
  },

  // 3. Forgot Password OTP Email
  sendForgotPasswordOtpEmail: async (email, otp, resetToken) => {
    const html = buildEmailTemplate({
      badge: 'PASSWORD RECOVERY',
      title: 'Reset Your Password',
      subtitle: 'Use the 6-digit OTP code below to set a new password.',
      contentHtml: `
        <div class="card" style="text-align: center;">
          <p style="margin-top: 0; font-size: 13px;">You requested a password reset for your L'Amour Gourmet account. Enter this one-time code on the reset screen:</p>
          <div style="background-color: #0f0c0a; border: 2px solid #D8632C; padding: 18px; border-radius: 12px; margin: 20px 0; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E8AC4E; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 11px; color: #A9865A; margin-bottom: 0;">⏱️ This code is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    });

    return sendMail({
      to: email,
      subject: `🔑 ${otp} is your L'Amour Gourmet Password Reset Code`,
      html
    });
  },

  // 4. Password Successfully Changed Email
  sendPasswordChangedEmail: async (user) => {
    const html = buildEmailTemplate({
      badge: 'SECURITY UPDATE',
      title: 'Password Updated Successfully',
      subtitle: 'The password for your account has been updated.',
      contentHtml: `
        <div class="card">
          <p style="margin-top: 0;">Hello <strong>${user.name || 'Valued Customer'}</strong>,</p>
          <p>Your password for <strong>${user.email}</strong> was successfully changed on <strong>${new Date().toLocaleString()}</strong>.</p>
          <p style="font-size: 12px; color: #A9865A; margin-bottom: 0;">If you made this change, you can safely disregard this email. If you did not authorize this change, please contact our support team immediately.</p>
        </div>
      `,
      actionButton: {
        text: 'Login to Account',
        url: 'http://localhost:5173'
      }
    });

    return sendMail({
      to: user.email,
      subject: `✅ Your L'Amour Gourmet Password Was Changed`,
      html
    });
  },

  // 5. Order Placed - Customer Invoice & Tracking Email
  sendOrderConfirmationEmail: async (order) => {
    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items_json || '[]');
    
    let itemsTableRows = items.map(item => `
      <tr>
        <td style="color: #F3E9D8;"><strong>${item.name}</strong></td>
        <td style="color: #D6C8B2; text-align: center;" class="ticket-mono">${item.quantity}</td>
        <td style="color: #E8AC4E; text-align: right;" class="ticket-mono">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const html = buildEmailTemplate({
      badge: `TICKET FIRED • #${order.id}`,
      title: 'Order Ticket Confirmed!',
      subtitle: 'Our tandoor chefs have fired your order on the charcoal grill.',
      contentHtml: `
        <div class="card">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(169,134,90,0.3); padding-bottom: 12px; margin-bottom: 12px;">
            <div>
              <span style="color: #A9865A; font-size: 10px; text-transform: uppercase; font-family: monospace;">TICKET ID</span>
              <div style="font-size: 16px; font-weight: bold; color: #E8AC4E; font-family: monospace;">${order.id}</div>
            </div>
            <div style="text-align: right;">
              <span style="color: #A9865A; font-size: 10px; text-transform: uppercase; font-family: monospace;">PAYMENT METHOD</span>
              <div style="font-size: 13px; font-weight: bold; color: #F3E9D8; text-transform: uppercase;">${order.payment_method} (${order.payment_status || 'PENDING'})</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Plated Dish</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>

          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(169,134,90,0.2); font-family: monospace; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #D6C8B2;">Subtotal</span>
              <span style="color: #F3E9D8;">₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #D6C8B2;">Delivery Fee</span>
              <span style="color: ${order.delivery_fee === 0 ? '#92b584' : '#F3E9D8'}; font-weight: bold;">${order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
            </div>
            ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #92b584;">
              <span>Discount</span>
              <span>-₹${order.discount}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(169,134,90,0.3); font-size: 15px; font-weight: bold;">
              <span style="color: #F3E9D8;">Total Charged</span>
              <span style="color: #E8AC4E;">₹${order.total}</span>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <h4 style="color: #E8AC4E; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; font-family: monospace;">📍 Delivery Destination</h4>
          <p style="margin: 0; color: #D6C8B2; font-size: 13px;">${order.delivery_address}</p>
          <p style="margin: 6px 0 0 0; color: #A9865A; font-size: 11px; font-family: monospace;">Recipient: ${order.customer_name} (${order.customer_phone})</p>
        </div>
      `,
      actionButton: {
        text: '🔥 Track Live Kitchen Telemetry',
        url: `http://localhost:5173`
      }
    });

    if (order.customer_email) {
      return sendMail({
        to: order.customer_email,
        subject: `🔥 Order Confirmed #${order.id} - L'Amour Gourmet (₹${order.total})`,
        html
      });
    }
  },

  // 6. Order Status Update Email (Preparing / Out For Delivery / Delivered)
  sendOrderStatusUpdateEmail: async (order, newStatus) => {
    if (!order.customer_email) return;

    let statusTitle = 'Order Update';
    let statusDesc = `Your order #${order.id} status is now ${newStatus}.`;
    let badge = newStatus.toUpperCase();

    if (newStatus === 'preparing') {
      statusTitle = '🔥 In the Tandoor';
      statusDesc = 'Your dishes are now baking over fruitwood charcoal in the clay oven.';
    } else if (newStatus === 'out_for_delivery') {
      statusTitle = '🛵 Rider Dispatched';
      statusDesc = `Rider ${order.driver_name || 'Express'} has picked up your thermal box and is en route!`;
    } else if (newStatus === 'delivered') {
      statusTitle = '✨ Order Delivered';
      statusDesc = 'Your artisanal feast has arrived. Enjoy your meal!';
    } else if (newStatus === 'cancelled') {
      statusTitle = '❌ Order Cancelled';
      statusDesc = `Order ticket #${order.id} has been cancelled.`;
    }

    const html = buildEmailTemplate({
      badge,
      title: statusTitle,
      subtitle: statusDesc,
      contentHtml: `
        <div class="card">
          <p style="margin: 0 0 8px 0;"><strong>Ticket Number:</strong> <span class="ticket-mono" style="color: #E8AC4E;">#${order.id}</span></p>
          <p style="margin: 0 0 8px 0;"><strong>Customer:</strong> ${order.customer_name}</p>
          <p style="margin: 0 0 8px 0;"><strong>Delivery Address:</strong> ${order.delivery_address}</p>
          ${order.driver_name ? `<p style="margin: 0; color: #92b584;"><strong>Rider Assigned:</strong> ${order.driver_name} (${order.driver_phone || '+91 98300 55443'})</p>` : ''}
        </div>
      `,
      actionButton: {
        text: 'View Order Status',
        url: `http://localhost:5173`
      }
    });

    return sendMail({
      to: order.customer_email,
      subject: `🛵 ${statusTitle} - Order #${order.id}`,
      html
    });
  },

  // 7. Table Reservation Confirmation Email
  sendReservationConfirmationEmail: async (reservation) => {
    const html = buildEmailTemplate({
      badge: 'TABLE PASS CONFIRMED',
      title: 'Your Table is Reserved!',
      subtitle: `We look forward to hosting you at L'Amour Gourmet.`,
      contentHtml: `
        <div class="card">
          <div style="background-color: #0f0c0a; border: 1px solid #A9865A; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #A9865A; font-size: 11px; font-family: monospace;">DATE & TIME</span>
              <strong style="color: #E8AC4E; font-size: 13px; font-family: monospace;">${reservation.reservation_date} @ ${reservation.reservation_time}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #A9865A; font-size: 11px; font-family: monospace;">PARTY SIZE</span>
              <strong style="color: #F3E9D8; font-size: 13px;">${reservation.guests} Guests</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #A9865A; font-size: 11px; font-family: monospace;">SEATING AREA</span>
              <strong style="color: #F3E9D8; font-size: 13px;">${reservation.seating_type || 'Main Dining'}</strong>
            </div>
          </div>
          <p style="margin: 0; font-size: 12px; color: #D6C8B2;">Guest Name: <strong>${reservation.name}</strong> (${reservation.phone})</p>
          ${reservation.special_request ? `<p style="margin: 8px 0 0 0; font-size: 11px; color: #A9865A;">Note: "${reservation.special_request}"</p>` : ''}
        </div>
      `,
      actionButton: {
        text: 'View Restaurant Location',
        url: 'http://localhost:5173/#location'
      }
    });

    if (reservation.email) {
      return sendMail({
        to: reservation.email,
        subject: `📅 Table Confirmed for ${reservation.guests} Guests on ${reservation.reservation_date} - L'Amour Gourmet`,
        html
      });
    }
  },

  // 8. Newsletter Welcome Email
  sendNewsletterWelcomeEmail: async (email) => {
    const html = buildEmailTemplate({
      badge: 'VIP SMOKE CIRCLE',
      title: 'Welcome to the Smoke Club!',
      subtitle: 'You are now subscribed to L\'Amour Gourmet chef dispatches and secret tastings.',
      contentHtml: `
        <div class="card">
          <p style="margin-top: 0;">Thank you for subscribing to our artisanal updates. You will be the first to know about seasonal tandoor menus, live kitchen masterclasses, and weekend chef specials.</p>
          <div style="background-color: #171310; border: 1px dashed #E8AC4E; padding: 14px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 11px; color: #A9865A; font-family: monospace; display: block; margin-bottom: 4px;">VIP SUBSCRIBER PROMO CODE</span>
            <strong style="font-size: 20px; color: #E8AC4E; letter-spacing: 2px; font-family: monospace;">VIPSMOKE20</strong>
            <span style="font-size: 12px; color: #92b584; display: block; margin-top: 4px;">(20% OFF on all charcoal platters)</span>
          </div>
          <p style="font-size: 12px; color: #A9865A; margin-bottom: 0;">Use this promo code at checkout or show it to your table steward.</p>
        </div>
      `,
      actionButton: {
        text: 'Explore Menu & Reserve',
        url: 'http://localhost:5173/#menu'
      }
    });

    return sendMail({
      to: email,
      subject: `🎁 Welcome to the Smoke Club! Your 20% Promo Voucher Inside`,
      html
    });
  },

  // 9. Customer Review Submission Thank You Email
  sendReviewThankYouEmail: async (email, userName, dishName) => {
    if (!email) return;

    const html = buildEmailTemplate({
      badge: 'FEEDBACK RECEIVED',
      title: 'Thank You for Your Review!',
      subtitle: `Your feedback helps us continuously perfect our tandoor crafts.`,
      contentHtml: `
        <div class="card">
          <p style="margin-top: 0;">Hello <strong>${userName}</strong>,</p>
          <p>Thank you for taking the time to share your dining experience${dishName ? ` regarding <strong>${dishName}</strong>` : ''}. Our master chefs review all feedback daily to ensure the highest standards of authentic fire cooking.</p>
        </div>
      `,
      actionButton: {
        text: 'Back to Restaurant',
        url: 'http://localhost:5173'
      }
    });

    return sendMail({
      to: email,
      subject: `⭐ Thank You for Reviewing L'Amour Gourmet!`,
      html
    });
  },

  // 10. Admin Notification - New Order Fired
  sendAdminNewOrderNotification: async (order) => {
    const { config } = getEmailConfig();
    const adminEmail = config.admin_notification_email;
    if (!adminEmail) return;

    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items_json || '[]');
    const itemsList = items.map(i => `• ${i.name} × ${i.quantity}`).join('<br>');

    const html = buildEmailTemplate({
      badge: 'KITCHEN ALERT: NEW ORDER',
      title: `New Order Ticket #${order.id}`,
      subtitle: `Total: ₹${order.total} • ${order.payment_method.toUpperCase()}`,
      contentHtml: `
        <div class="card">
          <p style="margin: 0 0 8px 0;"><strong>Customer:</strong> ${order.customer_name} (${order.customer_phone})</p>
          <p style="margin: 0 0 8px 0;"><strong>Delivery Address:</strong> ${order.delivery_address}</p>
          <div style="margin: 12px 0; padding: 10px; background-color: #0f0c0a; border-radius: 8px; font-family: monospace; font-size: 12px; color: #F3E9D8;">
            ${itemsList}
          </div>
        </div>
      `,
      actionButton: {
        text: 'Open Admin Portal',
        url: 'http://localhost:5173'
      }
    });

    return sendMail({
      to: adminEmail,
      subject: `🚨 [NEW ORDER] Ticket #${order.id} (₹${order.total}) - ${order.customer_name}`,
      html
    });
  }
};

module.exports = emailService;
