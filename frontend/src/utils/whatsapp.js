import { siteConfig } from '../config/siteConfig';

/**
 * Clean phone number to pure digits for wa.me URL
 * Strips '+', spaces, dashes, brackets etc.
 */
function getSanitizedWhatsAppNumber() {
  const rawNumber = 
    import.meta.env.VITE_WHATSAPP_NUMBER || 
    siteConfig.whatsappNumber || 
    "919876543210";
    
  return String(rawNumber).replace(/[^0-9]/g, '');
}

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
    selectedDemo = '',
    couponCode = '',
    discountText = '',
    finalPrice = '',
    requirements = 'I would like to discuss a website tailored for my business.'
  } = formData;

  const brandName = import.meta.env.VITE_BRAND_NAME || siteConfig.brandName || "LOCAL2BRAND";
  const targetNumber = getSanitizedWhatsAppNumber();

  const lines = [
    `👋 Hello ${brandName},`,
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
    finalPrice ? `💰 *Price Status:* ${finalPrice}` : '',
    `📝 *Project Requirements:*`,
    `${requirements || 'Ready for launch kickoff.'}`,
    '',
    'Please confirm project kickoff and next steps on WhatsApp.',
    'Thank you!'
  ].filter(Boolean);

  const fullMessage = lines.join('\n');
  const encoded = encodeURIComponent(fullMessage);
  
  return `https://wa.me/${targetNumber}?text=${encoded}`;
}

/**
 * Builds a direct general consultation WhatsApp link
 */
export function generateWhatsAppGeneralUrl(customMessage = '') {
  const brandName = import.meta.env.VITE_BRAND_NAME || siteConfig.brandName || "LOCAL2BRAND";
  const targetNumber = getSanitizedWhatsAppNumber();

  const defaultText = customMessage || 
    `Hello ${brandName}, I would like to explore your website design & development services for my business.`;
    
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(defaultText)}`;
}

/**
 * Helper to open WhatsApp URL in a new window/tab safely
 */
export function openWhatsAppChat(url) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
