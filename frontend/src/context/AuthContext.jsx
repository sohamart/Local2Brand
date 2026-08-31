import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('l2b_auth_token'));
  const [loading, setLoading] = useState(true);

  // Component-based Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('l2b_auth_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout(false);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const openAuthModal = (callback = null) => {
    setAuthSuccessCallback(() => callback);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name || 'User'}! 👋`);
      return res.user;
    }
    toast.error(res.message || 'Login failed');
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.token) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome to LOCAL2BRAND, ${res.user.name || 'User'}! 🎉`);
      return res.user;
    }
    toast.error(res.message || 'Registration failed');
    throw new Error(res.message || 'Registration failed');
  };

  const logout = (showToast = true) => {
    api.setToken(null);
    setToken(null);
    setUser(null);
    if (showToast) {
      toast.info('Logged out successfully. See you soon! 👋');
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/update-profile', profileData);
    if (res.success && res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
      return res.user;
    }
    throw new Error(res.message || 'Update failed');
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authSuccessCallback,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
