import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function RoomCard({ room }) {
  const [favorite, setFavorite] = useState(false);
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
    verified = false,
    distance = null,
  } = room || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } }}
      whileHover={{ scale: 1.035, boxShadow: '0 16px 48px 0 rgba(120,63,255,0.22)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'rgba(63,0,153,0.60)', // deep purple glass
        backgroundImage: 'linear-gradient(135deg, rgba(63,0,153,0.60) 0%, rgba(0,212,255,0.45) 100%)',
        borderRadius: 24,
        boxShadow: '0 8px 48px 0 rgba(120,63,255,0.13)',
        width: '100%',
        maxWidth: 350,
        minWidth: 240,
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '2.5px solid rgba(168,85,247,0.13)',
        margin: '0 auto',
        transition: 'box-shadow 0.22s cubic-bezier(.4,1.3,.6,1), transform 0.18s',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Verified badge */}
      {verified && (
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
        onClick={() => setFavorite(f => !f)}
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
      <img src={img} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover', background: 'rgba(168,85,247,0.08)', borderBottom: '2px solid rgba(168,85,247,0.13)' }} />
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
