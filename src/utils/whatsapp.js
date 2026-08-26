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
    requirements = 'I would like to discuss a website tailored for my business.'
  } = formData;

  const lines = [
    `👋 Hello ${siteConfig.brandName},`,
    '',
    'I am interested in getting a website for my brand/business.',
    '',
    `👤 *Name:* ${name || 'Not provided'}`,
    `🏢 *Business Name:* ${businessName || 'Not provided'}`,
    `📱 *Client Phone/WhatsApp:* ${whatsapp || 'Not provided'}`,
    `📧 *Email:* ${email || 'Not provided'}`,
    `🏷️ *Selected Demo:* ${selectedDemo}`,
    `🌐 *Website Type:* ${websiteType}`,
    `📝 *Requirements:*`,
    `${requirements || 'None specified.'}`,
    '',
    'Please share the next steps, customization details, and final pricing.',
    'Thank you!'
  ];

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
