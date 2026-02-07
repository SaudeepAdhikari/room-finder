import React, { useState, useRef } from 'react';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { toggleWishlistItem } from './api';
import { useToast } from './context/ToastContext';

import './RoomCard.css';
import { TiltCard, cardHover } from './utils/animations';

function RoomCard({ room }) {
  const { showToast } = useToast();
  const [favorite, setFavorite] = useState(room.isFavorited || false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleWishlistItem(room._id);
      setFavorite(res.isFavorited);
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update wishlist', 'error');
    }
  };

  // Mouse position for the glare effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed values for more natural movement
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Transform mouse position to glare position
  const glareX = useTransform(smoothX, [-100, 100], [-20, 20]);
  const glareY = useTransform(smoothY, [-100, 100], [-20, 20]);
  const glareOpacity = useTransform(
    smoothX,
    [-100, 0, 100],
    [0.2, 0.4, 0.2]
  );

  const cardRef = useRef(null);

  // Handle mouse move for glare effect
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Reset mouse position
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const {
    img = '',
    title = 'Room',
    location = '',
    price = '',
    summary = '',
    type = '',
    gender = '',
    wifi = false,
    attachedBath = false,
    parking = false,
    furnished = false,
    isVerified = false,
    distance = null,
  } = room || {};

  return (
    <motion.div
      ref={cardRef}
      className="room-card"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Verified badge */}
      {isVerified && (
        <span style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
          color: '#fff',
          borderRadius: 10,
          padding: '3px 14px',
          fontSize: 14,
          fontWeight: 800,
          zIndex: 2,
          boxShadow: '0 2px 12px #38bdf8cc',
          letterSpacing: 0.5,
        }}>✔ Verified</span>
      )}
      {/* Favorites button */}
      <motion.button
        onClick={handleFavoriteClick}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        whileTap={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: favorite
            ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
            : 'rgba(255,255,255,0.92)',
          border: 'none',
          borderRadius: '50%',
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: favorite ? '0 2px 12px #ec4899cc' : '0 2px 8px #0001',
          zIndex: 2,
          transition: 'box-shadow 0.18s, background 0.18s',
        }}
        onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px #a855f7'}
        onBlur={e => e.currentTarget.style.boxShadow = favorite ? '0 2px 12px #ec4899cc' : '0 2px 8px #0001'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={favorite ? 'filled' : 'empty'}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{ display: 'inline-block' }}
          >
            {favorite ? '💖' : '🤍'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <div className="room-card-image zoom-on-hover">
        <img src={img || "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/placeholder-img.jpg"} alt={title} />
        {/* Glare effect */}
        <motion.div
          className="card-glare"
          style={{
            x: glareX,
            y: glareY,
            opacity: glareOpacity
          }}
        />
      </div>
      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: '#fff', letterSpacing: 0.2 }}>
            {title}
          </div>
          <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: 19, marginBottom: 8 }}>NPR {price} <span style={{ fontWeight: 400, fontSize: 13 }}>/month</span></div>
          <div style={{ fontSize: 15, marginBottom: 8, color: '#e0e7ff', fontWeight: 500 }}>{summary}</div>
          <div style={{ fontSize: 14, color: '#c7bfff', marginBottom: 6 }}>{location}</div>
          {/* Distance */}
          {distance && (
            <div style={{ fontSize: 13, color: '#c7bfff', marginBottom: 6 }}>📍 {distance} km from you</div>
          )}
          {/* Icon badges */}
          <div style={{ display: 'flex', gap: 12, margin: '8px 0', flexWrap: 'wrap' }}>
            <span title="Room Type" style={{ color: '#fff', fontWeight: 700 }}>🛏️ {type}</span>
            {wifi && <span title="WiFi" style={{ color: '#38bdf8' }}>📶</span>}
            {attachedBath && <span title="Attached Bath" style={{ color: '#a855f7' }}>🚿</span>}
            {parking && <span title="Parking" style={{ color: '#38bdf8' }}>🚗</span>}
            {furnished && <span title="Furnished" style={{ color: '#a855f7' }}>🧺</span>}
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93, boxShadow: '0 0 0 6px #38bdf855' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 12px #38bdf8cc',
              transition: 'all 0.18s',
              flex: 1,
              minWidth: 0,
              marginRight: 4,
              letterSpacing: 0.2,
            }}
            onClick={() => alert('Contact feature coming soon!')}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px #a855f7'}
            onBlur={e => e.currentTarget.style.boxShadow = '0 2px 12px #38bdf8cc'}
          >
            Contact
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93, boxShadow: '0 0 0 6px #a855f755' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              background: 'rgba(255,255,255,0.98)',
              color: '#a855f7',
              border: '2px solid #a855f7',
              borderRadius: 14,
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 12px #a855f7cc',
              transition: 'all 0.18s',
              flex: 1,
              minWidth: 0,
              marginLeft: 4,
              letterSpacing: 0.2,
              textShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onClick={() => alert('View details feature coming soon!')}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px #38bdf8'}
            onBlur={e => e.currentTarget.style.boxShadow = '0 2px 12px #a855f7cc'}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 4px 16px #a855f7cc';
              e.currentTarget.style.border = '2px solid #38bdf8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.98)';
              e.currentTarget.style.color = '#a855f7';
              e.currentTarget.style.boxShadow = '0 2px 12px #a855f7cc';
              e.currentTarget.style.border = '2px solid #a855f7';
            }}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default RoomCard;
