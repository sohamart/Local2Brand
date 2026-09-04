import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export function ThemeProvider() {}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('l2b_cached_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('l2b_auth_token');
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Component-based Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  // Load user profile on mount (Cookie-first + Token sync)
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const savedToken = localStorage.getItem('l2b_auth_token');
      if (savedToken) {
        api.setToken(savedToken);
      }

      try {
        // Fetch /auth/me with credentials included (cookies and/or Bearer token)
        const res = await api.get('/auth/me');
        if (isMounted && res.success && res.user) {
          setUser(res.user);
          if (res.token) {
            setToken(res.token);
            api.setToken(res.token);
          } else if (savedToken) {
            setToken(savedToken);
          }
          localStorage.setItem('l2b_cached_user', JSON.stringify(res.user));
        }
      } catch (err) {
        // If server explicitly reports session expired / invalid token
        if (err.isAuthError || (err.status === 401 && (err.message?.includes('token') || err.message?.includes('expired') || err.message?.includes('no longer exists')))) {
          console.warn('Session expired, clearing credentials:', err.message);
          if (isMounted) {
            api.setToken(null);
            setToken(null);
            setUser(null);
            localStorage.removeItem('l2b_cached_user');
            localStorage.removeItem('l2b_auth_token');
          }
        } else {
          console.warn('Session check notice (offline or cold start, retaining session):', err.message);
          // Retain cached user from localStorage
          const cached = localStorage.getItem('l2b_cached_user');
          if (cached && isMounted) {
            try {
              setUser(JSON.parse(cached));
            } catch (e) {}
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
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
    if (res.success && res.user) {
      if (res.token) {
        api.setToken(res.token);
        setToken(res.token);
      }
      setUser(res.user);
      localStorage.setItem('l2b_cached_user', JSON.stringify(res.user));
      toast.success(`Welcome back, ${res.user.name || 'User'}! 👋`);
      return res.user;
    }
    toast.error(res.message || 'Login failed');
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.user) {
      if (res.token) {
        api.setToken(res.token);
        setToken(res.token);
      }
      setUser(res.user);
      localStorage.setItem('l2b_cached_user', JSON.stringify(res.user));
      toast.success(`Welcome to LOCAL2BRAND, ${res.user.name || 'User'}! 🎉`);
      return res.user;
    }
    toast.error(res.message || 'Registration failed');
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async (showToast = true, shouldRedirect = true) => {
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {}

    api.setToken(null);
    setToken(null);
    setUser(null);

    // Thoroughly clean all user session and chatbot keys
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('l2b_cached_user');
        localStorage.removeItem('l2b_auth_token');
        localStorage.removeItem('l2b_chat_messages');
        localStorage.removeItem('l2b_chat_session_id');
        localStorage.removeItem('l2b_chat_session_time');

        // Clear all user-specific prefixed keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('l2b_chat_') || key.startsWith('l2b_form_progress_') || key.startsWith('l2b_draft_'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
    }

    if (showToast) {
      toast.info('Logged out successfully. See you soon! 👋');
    }

    // Only redirect if user was in a protected dashboard
    if (shouldRedirect && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/';
      }
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/update-profile', profileData);
    if (res.success && res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
      localStorage.setItem('l2b_cached_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.message || 'Update failed');
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res;
  };

  const updateUserSession = (updatedUser) => {
    if (!updatedUser) return;
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('l2b_cached_user', JSON.stringify(merged));
      return merged;
    });
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
        updateUserSession,
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
