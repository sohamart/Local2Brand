import React, { createContext, useContext, useState } from 'react';

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    selectedDemo: '',
    websiteType: 'Custom Website',
    initialRequirements: '',
    price: '',
    autoApplyOffer: false
  });

  const openOrderModal = (data = {}) => {
    const isOfferTrigger = 
      data.autoApplyOffer === true ||
      data.websiteType?.toLowerCase().includes('offer') ||
      data.websiteType?.toLowerCase().includes('20%') ||
      data.websiteType?.toLowerCase().includes('india2025') ||
      false;

    setModalData({
      selectedDemo: data.selectedDemo || '',
      websiteType: data.websiteType || (data.selectedDemo ? `Demo: ${data.selectedDemo}` : 'Custom Website'),
      initialRequirements: data.initialRequirements || (data.selectedDemo ? `I would like to customize the "${data.selectedDemo}" website template for my brand.` : ''),
      price: data.price || '',
      autoApplyOffer: isOfferTrigger
    });
    setIsOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeOrderModal = () => {
    setIsOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <OrderModalContext.Provider value={{ isOpen, modalData, openOrderModal, closeOrderModal }}>
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
