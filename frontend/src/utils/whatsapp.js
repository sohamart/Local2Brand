import { siteConfig } from '../config/siteConfig';

/**
 * Builds an encoded WhatsApp URL for custom website orders
 */
export function generateWhatsAppOrderUrl(formData = {}) {
  const {
    name = '',
    businessName = '',
    whatsapp = '',
    email = '',
    websiteType = 'Custom Website',
    selectedDemo = 'Custom Requirement',
    couponCode = '',
    discountText = '',
    finalPrice = '',
    requirements = 'I would like to discuss a website tailored for my business.'
  } = formData;

  const lines = [
    `👋 Hello ${siteConfig.brandName},`,
    '',
    'I want to start my website project with you.',
    '',
    `👤 *Name:* ${name || 'Not provided'}`,
    `🏢 *Business / Brand:* ${businessName || 'Not provided'}`,
    `📱 *WhatsApp/Phone:* ${whatsapp || 'Not provided'}`,
    `📧 *Email:* ${email || 'Not provided'}`,
    `🌐 *Website Type:* ${websiteType}`,
    selectedDemo ? `🏷️ *Template Reference:* ${selectedDemo}` : '',
    couponCode ? `🔥 *Applied Coupon:* ${couponCode} (${discountText || '20% OFF'})` : '',
    finalPrice ? `💰 *Estimated Price:* ${finalPrice}` : '',
    `📝 *Project Requirements:*`,
    `${requirements || 'Ready for 48h launch kickoff.'}`,
    '',
    'Please confirm project kickoff and next steps on WhatsApp.',
    'Thank you!'
  ].filter(Boolean);

  const fullMessage = lines.join('\n');
  const encoded = encodeURIComponent(fullMessage);
  
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

/**
 * Builds a direct general consultation WhatsApp link
 */
export function generateWhatsAppGeneralUrl(customMessage = '') {
  const defaultText = customMessage || 
    `Hello ${siteConfig.brandName}, I would like to explore your website design & development services for my business.`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(defaultText)}`;
}

/**
 * Helper to open WhatsApp URL in a new window/tab safely
 */
export function openWhatsAppChat(url) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
