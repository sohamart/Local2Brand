import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gourmetos_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.customer;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('gourmetos_user');
  });

  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Order Confirmed', message: 'Your order #ORD-9842 has been accepted by the kitchen.', time: '10m ago', unread: true },
    { id: 'notif-2', title: 'Imperial Privileges', message: 'You earned 48 Loyalty points from your recent banquet.', time: '1h ago', unread: false }
  ]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gourmetos_user', JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('gourmetos_user');
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const login = (roleKey = 'customer', customUser = null) => {
    let userToSet = customUser;
    if (!userToSet && DEMO_USERS[roleKey]) {
      userToSet = DEMO_USERS[roleKey];
    }
    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    return userToSet;
  };

  const register = (userData) => {
    const newUser = {
      id: `user-cust-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98300 00000',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      loyaltyPoints: 100, // 100 bonus welcome points
      referralCode: userData.name.slice(0, 4).toUpperCase() + '20',
      savedAddresses: [
        { id: 'addr-1', title: 'Home', address: 'Flat 402, Royal Palms Residency', landmark: 'Near City Centre 1', city: 'Kolkata', pincode: '700064', isDefault: true }
      ]
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gourmetos_user');
  };

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
      setIsAuthenticated(true);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      register,
      logout,
      switchRole,
      isDeveloper: currentUser?.role === 'developer',
      isOwner: currentUser?.role === 'owner',
      isStaff: currentUser?.role === 'staff',
      isCustomer: currentUser?.role === 'customer',
      notifications,
      markAllNotificationsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
