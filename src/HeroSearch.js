import React, { useState } from 'react';

function HeroSearch({ onSearch }) {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSearch && onSearch({ location, price, date });
  };

  return (
    <section style={{
      minHeight: 320,
      background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0 32px 0',
      position: 'relative',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 16,
        boxShadow: '0 4px 32px #0002',
        padding: 32,
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <h1 style={{fontSize: 36, color: 'var(--primary)', marginBottom: 8}}>Find Your Perfect Room or Property</h1>
        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{padding: 12, fontSize: 16, width: 140, borderRadius: 8, border: '1px solid #ccc'}}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{padding: 12, fontSize: 16, width: 110, borderRadius: 8, border: '1px solid #ccc'}}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{padding: 12, fontSize: 16, width: 140, borderRadius: 8, border: '1px solid #ccc'}}
          />
          <button
            type="submit"
            style={{
              background: 'var(--primary-gradient)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 28px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #1976d233',
              marginLeft: 4
            }}
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}

export default HeroSearch;
