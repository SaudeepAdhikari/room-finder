import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div 
        className="toggle-track"
        animate={{ backgroundColor: isDark ? '#3B4252' : '#D1D5DB' }}
      >
        <motion.div 
          className="toggle-thumb"
          animate={{ 
            x: isDark ? '22px' : '2px',
            backgroundColor: isDark ? '#8B5CF6' : '#F59E0B'
          }}
        >
          {/* Sun/Moon Icon */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
            animate={{ 
              rotate: isDark ? 0 : 180,
              opacity: 1
            }}
          >
            {isDark ? (
              // Moon icon
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            ) : (
              // Sun icon
              <circle cx="12" cy="12" r="5"></circle>
            )}
            {!isDark && <line x1="12" y1="1" x2="12" y2="3"></line>}
            {!isDark && <line x1="12" y1="21" x2="12" y2="23"></line>}
            {!isDark && <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>}
            {!isDark && <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>}
            {!isDark && <line x1="1" y1="12" x2="3" y2="12"></line>}
            {!isDark && <line x1="21" y1="12" x2="23" y2="12"></line>}
            {!isDark && <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>}
            {!isDark && <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>}
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
