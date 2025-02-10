/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import Sidebar from './component/sidebar';
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
    } else {
      // Default to light mode
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      const mode = newMode ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      document.body.classList.toggle('dark-mode', newMode);
      document.body.classList.toggle('light-mode', !newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
      <Sidebar />
    </ThemeContext.Provider>
  );
};
