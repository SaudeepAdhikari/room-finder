import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = [
  'Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Birgunj', 'Dharan', 'Butwal', 'Bharatpur', 'Hetauda', 'Nepalgunj',
  'Itahari', 'Janakpur', 'Dhangadhi', 'Bhaktapur', 'Ghorahi', 'Tulsipur', 'Sunsari', 'Birtamode', 'Damak', 'Banepa'
];

function CityAutosuggest({ value, onChange, placeholder = 'Location' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleInput = e => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 0) {
      const filtered = CITIES.filter(city =>
        city.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShow(true);
    } else {
      setSuggestions([]);
      setShow(false);
    }
  };

  const handleSelect = city => {
    onChange(city);
    setShow(false);
    setFocused(false);
  };

  const handleFocus = () => {
    setFocused(true);
    if (value && suggestions.length > 0) {
      setShow(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
      setShow(false);
    }, 200);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 'var(--input-height)',
          padding: 'var(--input-padding)',
          fontSize: 'var(--font-size-base)',
          borderRadius: 'var(--input-radius)',
          border: focused ? 'var(--input-border-focus)' : 'var(--input-border)',
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          transition: 'all var(--transition)',
        }}
        autoComplete="off"
      />

      <AnimatePresence>
        {show && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)',
              zIndex: 1000,
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            {suggestions.map((city, index) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(city)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--text-primary)',
                  borderBottom: index < suggestions.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                    🏙️
                  </span>
                  {city}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CityAutosuggest;
