import React, { useState } from 'react';
import CityAutosuggest from './components/CityAutosuggest';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [price, setPrice] = useState('');
  const [roomType, setRoomType] = useState('');
  const [amenityState, setAmenityState] = useState({});

  const handleAmenityToggle = value => {
    setAmenityState(prev => ({ ...prev, [value]: !prev[value] }));
  };

  const handleModalSearch = e => {
    e.preventDefault();
    onSearch && onSearch({ location: searchValue, price, roomType, ...amenityState });
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(63, 0, 153, 0.60)',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            flex: 1,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span role="img" aria-label="search">🔍</span> Search Rooms
        </button>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '60px',
              margin: '0 auto',
              zIndex: 100,
              background: 'var(--surface)',
              borderRadius: 18,
              boxShadow: '0 8px 32px 0 rgba(120,63,255,0.18)',
              padding: 28,
              maxWidth: 480,
              minWidth: 260,
              border: '2px solid var(--primary-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 18,
            }}
          >
            <form onSubmit={handleModalSearch} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Type to search rooms..."
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1.5px solid var(--primary-light)',
                    fontSize: 17,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(f => !f)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: 4,
                    fontSize: 22,
                    color: 'var(--primary)',
                  }}
                  title="Show Filters"
                >
                  <span role="img" aria-label="filter">🔽</span>
                  {/* You can replace with a funnel SVG/icon if you have one */}
                </button>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  fontSize: 17,
                  fontWeight: 700,
                  borderRadius: 12,
                  background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px #7c3aed22',
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Search
              </motion.button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    style={{ marginTop: 10, background: 'var(--surface-hover)', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px #7c3aed11' }}
                  >
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 600, fontSize: 15 }}>Max Price (NPR)</label>
                      <input
                        type="number"
                        placeholder="e.g., 15000"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1.5px solid var(--primary-light)',
                          fontSize: 15,
                          marginTop: 4,
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 600, fontSize: 15 }}>Room Type</label>
                      <select
                        value={roomType}
                        onChange={e => setRoomType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1.5px solid var(--primary-light)',
                          fontSize: 15,
                          marginTop: 4,
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
                    <div>
                      <label style={{ fontWeight: 600, fontSize: 15 }}>Amenities</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                        {amenities.map(amenity => (
                          <button
                            key={amenity.value}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity.value)}
                            style={{
                              background: amenityState[amenity.value]
                                ? 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)'
                                : 'rgba(255,255,255,0.13)',
                              color: amenityState[amenity.value]
                                ? '#fff'
                                : 'var(--primary)',
                              border: '1.5px solid',
                              borderColor: amenityState[amenity.value]
                                ? '#38bdf8'
                                : 'var(--primary-light)',
                              borderRadius: 16,
                              padding: '6px 14px',
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: amenityState[amenity.value] ? '0 2px 8px #38bdf8' : 'none',
                              transition: 'all 0.18s',
                            }}
                          >
                            <span style={{ fontSize: 16 }}>{amenity.icon}</span> {amenity.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 10,
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                alignSelf: 'flex-end',
              }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default HeroSearch;
