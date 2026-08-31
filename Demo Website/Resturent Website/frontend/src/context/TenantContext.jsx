import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANTS } from '../data/mockData';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('gourmetos_restaurants');
    return saved ? JSON.parse(saved) : RESTAURANTS;
  });

  const [activeRestaurantId, setActiveRestaurantId] = useState(() => {
    const saved = localStorage.getItem('gourmetos_active_tenant');
    return saved || RESTAURANTS[0].id;
  });

  const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('gourmetos_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('gourmetos_active_tenant', activeRestaurantId);
    
    // Apply dynamic CSS variables from active restaurant theme
    if (activeRestaurant && activeRestaurant.theme) {
      const root = document.documentElement;
      const theme = activeRestaurant.theme;
      
      root.style.setProperty('--brand-primary', theme.primary);
      root.style.setProperty('--brand-primary-hover', theme.primaryHover || theme.primary);
      root.style.setProperty('--brand-primary-glow', theme.primaryGlow || 'rgba(230, 57, 70, 0.4)');
      root.style.setProperty('--brand-secondary', theme.secondary);
      root.style.setProperty('--brand-accent', theme.accent);
      root.style.setProperty('--font-heading', theme.fontHeading || 'Playfair Display');
      root.style.setProperty('--font-body', theme.fontBody || 'Outfit');
      root.style.setProperty('--radius-custom', theme.borderRadius || '16px');
    }
  }, [activeRestaurantId, activeRestaurant]);

  const switchTenant = (restaurantId) => {
    setActiveRestaurantId(restaurantId);
  };

  const updateRestaurant = (updatedData) => {
    setRestaurants(prev => prev.map(r => r.id === updatedData.id ? { ...r, ...updatedData } : r));
  };

  const addRestaurant = (newRestaurant) => {
    setRestaurants(prev => [newRestaurant, ...prev]);
    setActiveRestaurantId(newRestaurant.id);
  };

  return (
    <TenantContext.Provider value={{
      restaurants,
      activeRestaurant,
      activeRestaurantId,
      switchTenant,
      updateRestaurant,
      addRestaurant
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
};
