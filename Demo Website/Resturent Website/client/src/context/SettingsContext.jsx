import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    restaurant_name: "L'Amour Gourmet & Grill",
    tagline: "Authentic Charcoal Grills & Artisanal Cuisine",
    phone: "+91 98765 43210",
    whatsapp_number: "919876543210",
    email: "contact@lamourgourmet.com",
    address: "12/A Park Avenue, Gourmet Boulevard, Central City",
    restaurant_lat: "22.5726",
    restaurant_lng: "88.3639",
    opening_hours: "11:30 AM - 11:30 PM (Mon-Sun)",
    delivery_fee: "49",
    free_delivery_above: "499",
    min_order_amount: "199",
    enable_cod: "true",
    enable_whatsapp_order: "true",
    enable_upi_qr: "true",
    upi_id: "lamourgourmet@oksbi",
    upi_name: "L'Amour Gourmet Restaurant",
    enable_razorpay: "true",
    razorpay_key_id: "rzp_test_simulated_key",
    has_razorpay_secret: false
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.warn('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      refreshSettings: fetchSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
