import React, { createContext, useContext, useState } from 'react';

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const [inquiryData, setInquiryData] = useState({
    selectedDemo: '',
    websiteType: 'Custom Website',
    initialRequirements: '',
    price: '',
    industry: '',
    autoApplyOffer: false,
  });

  const [callbackData, setCallbackData] = useState({
    topic: 'General Website Discussion',
    preferredTime: 'As soon as possible',
  });

  const openOrderModal = (data = {}) => {
    const isOfferTrigger =
      data.autoApplyOffer === true ||
      data.websiteType?.toLowerCase().includes('offer') ||
      data.websiteType?.toLowerCase().includes('20%') ||
      data.websiteType?.toLowerCase().includes('india2025') ||
      false;

    setInquiryData({
      selectedDemo: data.selectedDemo || '',
      websiteType: data.websiteType || (data.selectedDemo ? `Demo: ${data.selectedDemo}` : 'Custom Website'),
      initialRequirements:
        data.initialRequirements ||
        (data.selectedDemo ? `I would like to customize the "${data.selectedDemo}" website template for my brand.` : ''),
      price: data.price || '',
      industry: data.industry || '',
      autoApplyOffer: isOfferTrigger,
    });
    setIsInquiryOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeOrderModal = () => {
    setIsInquiryOpen(false);
    if (typeof document !== 'undefined' && !isCallbackOpen) {
      document.body.style.overflow = 'auto';
    }
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
