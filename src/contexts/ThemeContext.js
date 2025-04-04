import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Theme definitions
const themes = {
  dark: {
    name: 'dark',
    colors: {
      primary: '#9e69fd',
      secondary: '#64c2ff',
      background: '#0f0f2d',
      backgroundSecondary: '#1a1a4a',
      text: '#ffffff',
      textSecondary: '#b3b3cc',
      border: 'rgba(255, 255, 255, 0.1)',
      error: '#ff6b6b',
      success: '#66bb6a',
      warning: '#ffa000',
      info: '#42a5f5',
    },
    gradients: {
      primary: 'linear-gradient(90deg, #9e69fd, #64c2ff)',
      background: 'linear-gradient(135deg, #0f0f2d, #1a1a4a)',
    },
    shadows: {
      small: '0 2px 8px rgba(0, 0, 0, 0.2)',
      medium: '0 4px 20px rgba(0, 0, 0, 0.2)',
      large: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.8rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '9999px',
    },
  },
  light: {
    name: 'light',
    colors: {
      primary: '#7c3aed',
      secondary: '#3b82f6',
      background: '#f8f9fa',
      backgroundSecondary: '#e9ecef',
      text: '#212529',
      textSecondary: '#6c757d',
      border: 'rgba(0, 0, 0, 0.1)',
      error: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
    },
    gradients: {
      primary: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    },
    shadows: {
      small: '0 2px 8px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 20px rgba(0, 0, 0, 0.1)',
      large: '0 8px 32px rgba(0, 0, 0, 0.15)',
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.8rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '9999px',
    },
  },
};

// Create theme context
const ThemeContext = createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');
  
  // Toggle theme
  const toggleTheme = useCallback(() => {
    setThemeName(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);
  
  // Set CSS variables
  useEffect(() => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Set color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set gradient variables
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
    
    // Set shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    // Set document class
    document.body.className = themeName;
  }, [themeName]);
  
  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook for accessing theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 