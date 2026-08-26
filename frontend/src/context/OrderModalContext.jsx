import React, { createContext, useContext, useState } from 'react';

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    selectedDemo: '',
    websiteType: 'Custom Website',
    initialRequirements: '',
    price: ''
  });

  const openOrderModal = (data = {}) => {
    setModalData({
      selectedDemo: data.selectedDemo || '',
      websiteType: data.websiteType || (data.selectedDemo ? `Demo: ${data.selectedDemo}` : 'Custom Website'),
      initialRequirements: data.initialRequirements || (data.selectedDemo ? `I would like to customize the "${data.selectedDemo}" website template for my brand.` : ''),
      price: data.price || ''
    });
    setIsOpen(true);
    // Prevent body background scrolling when modal is open
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
