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
        background: 'rgba(63, 0, 153, 0.60)', // deep purple glass
        backgroundImage: 'linear-gradient(135deg, rgba(63,0,153,0.60) 0%, rgba(0,212,255,0.45) 100%)',
        borderRadius: '32px',
        boxShadow: '0 8px 48px 0 rgba(120,63,255,0.13)',
        padding: '48px 36px',
        maxWidth: '820px',
        margin: '0 auto',
        border: '2.5px solid rgba(168,85,247,0.13)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Glass highlight reflection */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 0, height: 22,
        borderRadius: '32px 32px 0 0',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <form onSubmit={handleSubmit}>
        {/* Main Search Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 28,
          marginBottom: 32,
        }}>
          {/* Location */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 700,
              color: '#e0e7ff',
              marginBottom: 8,
              letterSpacing: 0.2,
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
              fontSize: 15,
              fontWeight: 700,
              color: '#e0e7ff',
              marginBottom: 8,
              letterSpacing: 0.2,
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
                height: 44,
                padding: '0 14px',
                fontSize: 16,
                borderRadius: 14,
                border: '2px solid rgba(168,85,247,0.13)',
                background: 'rgba(255,255,255,0.18)',
                color: '#2d2250',
                fontWeight: 600,
                boxShadow: '0 1px 4px rgba(120,63,255,0.06)',
                outline: 'none',
                transition: 'border 0.18s',
              }}
            />
          </div>
          {/* Room Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 700,
              color: '#e0e7ff',
              marginBottom: 8,
              letterSpacing: 0.2,
            }}>
              Room Type
            </label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                fontSize: 16,
                borderRadius: 14,
                border: '2px solid rgba(168,85,247,0.13)',
                background: 'rgba(255,255,255,0.18)',
                color: '#2d2250',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(120,63,255,0.06)',
                outline: 'none',
                transition: 'border 0.18s',
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
        <div style={{ marginBottom: 32 }}>
          <label style={{
            display: 'block',
            fontSize: 15,
            fontWeight: 700,
            color: '#e0e7ff',
            marginBottom: 10,
            letterSpacing: 0.2,
          }}>
            Amenities
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {amenities.map(amenity => (
              <motion.button
                key={amenity.value}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAmenityToggle(amenity.value)}
                style={{
                  background: amenityState[amenity.value]
                    ? 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)'
                    : 'rgba(255,255,255,0.13)',
                  color: amenityState[amenity.value]
                    ? '#fff'
                    : '#2d2250',
                  border: '2px solid',
                  borderColor: amenityState[amenity.value]
                    ? '#38bdf8'
                    : 'rgba(168,85,247,0.13)',
                  borderRadius: 22,
                  padding: '8px 18px',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: amenityState[amenity.value] ? '0 2px 8px #38bdf8' : 'none',
                  transition: 'all 0.18s',
                }}
              >
                <span style={{ fontSize: 18 }}>
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
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '16px 0',
            fontSize: 18,
            fontWeight: 800,
            borderRadius: 16,
            background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 24px 0 rgba(56,189,248,0.13)',
            letterSpacing: 0.5,
            cursor: 'pointer',
            marginTop: 8,
            transition: 'background 0.18s',
          }}
        >
          <span role="img" aria-label="search" style={{ marginRight: 8 }}>🔍</span> Search Rooms
        </motion.button>
      </form>
    </motion.div>
  );
}

export default HeroSearch;
