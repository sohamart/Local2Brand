import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const navigate = useNavigate();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const [inquiryData, setInquiryData] = useState({
    selectedDemo: '',
    websiteType: 'Custom Website',
    initialRequirements: '',
    price: '',
    industry: '',
    autoApplyOffer: false,
    promoCode: '',
    discountPercent: 0,
  });

  const [callbackData, setCallbackData] = useState({
    topic: 'General Website Discussion',
    preferredTime: 'As soon as possible',
  });

  const openOrderModal = (data = {}) => {
    const isOfferTrigger =
      data.autoApplyOffer === true ||
      Boolean(data.promoCode) ||
      data.websiteType?.toLowerCase().includes('offer') ||
      data.websiteType?.toLowerCase().includes('20%') ||
      data.websiteType?.toLowerCase().includes('india2025') ||
      true; // Default to activating coupon for direct orders

    const promoCode = data.promoCode || (isOfferTrigger ? 'INDIA2025' : '');
    const discountPercent = data.discountPercent || (isOfferTrigger ? 20 : 0);
    const rawSlug = data.templateId || data.slug || data.selectedDemoSlug || data.selectedDemo || data.websiteType || '';
    const cleanSlug = typeof rawSlug === 'string' && !rawSlug.includes(' ') ? rawSlug : '';
    const templateTitle = data.selectedDemo || data.templateTitle || data.websiteType || 'Custom Website';
    const price = data.price || data.priceInr || '';
    const category = data.category || '';

    const params = new URLSearchParams();
    if (rawSlug) params.set('template', rawSlug);
    if (templateTitle) params.set('title', templateTitle);
    if (category) params.set('category', category);
    if (price) params.set('price', price);
    if (promoCode) params.set('coupon', promoCode);
    if (discountPercent) params.set('discount', String(discountPercent));

    const targetPath = cleanSlug
      ? `/get-started/${encodeURIComponent(cleanSlug)}?${params.toString()}`
      : `/get-started?${params.toString()}`;

    // Directly navigate to dedicated /get-started form page with pre-filled state!
    navigate(targetPath, {
      state: {
        selectedDemo: templateTitle,
        templateId: cleanSlug || rawSlug,
        slug: cleanSlug || rawSlug,
        category,
        price,
        promoCode,
        discountPercent,
        initialRequirements: data.initialRequirements || '',
        demoDetails: data
      }
    });
  };

  const closeOrderModal = () => {
    setIsInquiryOpen(false);
  };

  const openCallbackModal = (data = {}) => {
    setCallbackData({
      topic: data.topic || 'General Website Discussion',
      preferredTime: data.preferredTime || 'As soon as possible',
    });
    setIsCallbackOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCallbackModal = () => {
    setIsCallbackOpen(false);
    if (typeof document !== 'undefined' && !isInquiryOpen) {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <OrderModalContext.Provider
      value={{
        isOpen: isInquiryOpen,
        isInquiryOpen,
        isCallbackOpen,
        modalData: inquiryData,
        inquiryData,
        callbackData,
        openOrderModal,
        closeOrderModal,
        openCallbackModal,
        closeCallbackModal,
      }}
    >
      {children}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(OrderModalContext);
  if (!context) {
    throw new Error('useOrderModal must be used within an OrderModalProvider');
  }
  return context;
}
