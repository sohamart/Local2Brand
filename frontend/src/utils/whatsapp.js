import { siteConfig } from '../config/siteConfig';

/**
 * Returns a strictly numeric phone number string for WhatsApp URLs
 */
export function getSanitizedWhatsAppNumber() {
  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNumber) {
    return String(envNumber).replace(/[^0-9]/g, '');
  }
  const configNumber = siteConfig.whatsappNumber || siteConfig.phone || '919064971842';
  return String(configNumber).replace(/[^0-9]/g, '');
}

/**
 * Generates direct WhatsApp message URL with order & requirements data
 */
export function generateWhatsAppOrderUrl(orderData = {}) {
  const {
    websiteType = 'Custom Website',
    businessName = 'Not specified',
    name = '',
    phone = '',
    requirements = '',
    selectedDemo = '',
    coupon = '',
    discountPercentage = 0,
    price = ''
  } = orderData;

  const number = getSanitizedWhatsAppNumber();

  const messageLines = [
    '✨ *LOCAL2BRAND — NEW PROJECT INQUIRY* ✨',
    '━━━━━━━━━━━━━━━━━━━━',
    `👤 *Client Name:* ${name || 'N/A'}`,
    `📱 *Phone / Contact:* ${phone || 'N/A'}`,
    `🏢 *Business / Brand:* ${businessName}`,
    `🌐 *Requested Scope:* ${websiteType}`,
    selectedDemo ? `🎯 *Chosen Demo:* ${selectedDemo}` : '',
    price ? `💰 *Budget / Listed Tier:* ${price}` : '',
    coupon ? `🏷️ *Coupon Applied:* ${coupon} (${discountPercentage}% OFF)` : '',
    requirements ? `\n📝 *Project Requirements:*\n"${requirements}"` : '',
    '\n━━━━━━━━━━━━━━━━━━━━',
    '⚡ *Turnaround Goal:* 3 - 7 Days Delivery',
    '🇮🇳 *Origin:* local2brand.com'
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

/**
 * Generates quick general WhatsApp support URL
 */
export function generateWhatsAppGeneralUrl(inquiry = '') {
  const number = getSanitizedWhatsAppNumber();
  const text = inquiry || 'Hi LOCAL2BRAND team! I want to discuss a new website project for my brand.';
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Opens WhatsApp in a new tab safely
 */
export function openWhatsAppChat(url) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
