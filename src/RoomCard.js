import React, { useState } from 'react';

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
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: 'var(--card-radius, 16px)',
      boxShadow: 'var(--card-shadow, 0 2px 8px #1976d211)',
      width: '100%',
      maxWidth: 340,
      minWidth: 240,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      border: 'var(--card-border, none)',
      margin: '0 auto',
      transition: 'box-shadow var(--transition)',
    }}>
      {/* Verified badge */}
      {verified && (
        <span style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'var(--success, #4caf50)',
          color: '#fff',
          borderRadius: 8,
          padding: '2px 10px',
          fontSize: 13,
          fontWeight: 700,
          zIndex: 2,
          boxShadow: '0 2px 8px #0002',
        }}>✔ Verified</span>
      )}
      {/* Favorites button */}
      <button
        onClick={() => setFavorite(f => !f)}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0001',
          zIndex: 2,
          transition: 'box-shadow var(--transition)',
        }}
        onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)'}
        onBlur={e => e.currentTarget.style.boxShadow = '0 2px 8px #0001'}
      >
        {favorite ? '💖' : '🤍'}
      </button>
      <img src={img} alt={title} style={{ width: '100%', height: 150, objectFit: 'cover', background: 'var(--surface-hover)', borderBottom: '1px solid var(--gray-200)' }} />
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 190 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
            {title}
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Rs. {price} <span style={{ fontWeight: 400, fontSize: 13 }}>/month</span></div>
          <div style={{ fontSize: 15, marginBottom: 8, color: 'var(--text-secondary)' }}>{summary}</div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 6 }}>{location}</div>
          {/* Distance */}
          {distance && (
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 6 }}>📍 {distance} km from you</div>
          )}
          {/* Icon badges */}
          <div style={{ display: 'flex', gap: 10, margin: '6px 0', flexWrap: 'wrap' }}>
            <span title="Room Type">🛏️ {type}</span>
            {wifi && <span title="WiFi">📶</span>}
            {attachedBath && <span title="Attached Bath">🚿</span>}
            {parking && <span title="Parking">🚗</span>}
            {furnished && <span title="Furnished">🧺</span>}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'var(--primary-gradient)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--btn-radius, 10px)',
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              transition: 'box-shadow var(--transition)',
              flex: 1,
              minWidth: 0,
              marginRight: 4,
            }}
            onClick={() => alert('Contact feature coming soon!')}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)'}
            onBlur={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
          >
            Contact
          </button>
          <button
            style={{
              background: 'var(--surface)',
              color: 'var(--primary)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--btn-radius, 10px)',
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              transition: 'box-shadow var(--transition)',
              flex: 1,
              minWidth: 0,
              marginLeft: 4,
            }}
            onClick={() => alert('View details feature coming soon!')}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)'}
            onBlur={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
