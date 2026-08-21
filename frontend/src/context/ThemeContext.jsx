import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    localStorage.setItem('theme', 'light');
  }, []);

  const toggleTheme = () => {
    // Force light theme, no-op toggle
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
