import React, { useState } from 'react';
import CityAutosuggest from './components/CityAutosuggest';
import { motion } from 'framer-motion';

const roomTypes = [
  { label: 'Private', value: 'Private' },
  { label: 'Shared', value: 'Shared' }
];

const amenities = [
  { label: 'WiFi', value: 'wifi', icon: '📶' },
  { label: 'Parking', value: 'parking', icon: '🚗' },
  { label: 'Furnished', value: 'furnished', icon: '🪑' },
  { label: 'Attached Bath', value: 'attachedBath', icon: '🚿' },
  { label: 'Pet Allowed', value: 'pet', icon: '🐾' }
];

function HeroSearch({ onSearch }) {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [roomType, setRoomType] = useState('');
  const [amenityState, setAmenityState] = useState({});

  const handleAmenityToggle = value => {
    setAmenityState(prev => ({ ...prev, [value]: !prev[value] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSearch && onSearch({ location, price, roomType, ...amenityState });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-8)',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Main Search Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}>
          {/* Location */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)',
            }}>
              Location
            </label>
            <CityAutosuggest
              value={location}
              onChange={setLocation}
              placeholder="Enter city or area"
            />
          </div>

          {/* Price */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)',
            }}>
              Max Price (NPR)
            </label>
            <input
              type="number"
              placeholder="e.g., 15000"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={{
                width: '100%',
                height: 'var(--input-height)',
                padding: 'var(--input-padding)',
                fontSize: 'var(--font-size-base)',
                borderRadius: 'var(--input-radius)',
                border: 'var(--input-border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Room Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)',
            }}>
              Room Type
            </label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              style={{
                width: '100%',
                height: 'var(--input-height)',
                padding: 'var(--input-padding)',
                fontSize: 'var(--font-size-base)',
                borderRadius: 'var(--input-radius)',
                border: 'var(--input-border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <option value="">Any Type</option>
              {roomTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-3)',
          }}>
            Amenities
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}>
            {amenities.map(amenity => (
              <motion.button
                key={amenity.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAmenityToggle(amenity.value)}
                style={{
                  background: amenityState[amenity.value]
                    ? 'var(--primary-gradient)'
                    : 'var(--surface-hover)',
                  color: amenityState[amenity.value]
                    ? 'var(--text-inverse)'
                    : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: amenityState[amenity.value]
                    ? 'var(--primary)'
                    : 'var(--gray-200)',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  transition: 'all var(--transition)',
                }}
              >
                <span style={{ fontSize: 'var(--font-size-base)' }}>
                  {amenity.icon}
                </span>
                {amenity.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            height: 'var(--btn-height)',
            background: 'var(--primary-gradient)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition)',
            boxShadow: 'var(--shadow-md)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-gradient-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary-gradient)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          🔍 Search Rooms
        </motion.button>
      </form>
    </motion.div>
  );
}

export default HeroSearch;
