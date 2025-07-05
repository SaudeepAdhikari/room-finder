import React from 'react';

const categories = [
  { label: 'Room', value: 'Room', icon: '🛏️' },
  { label: 'Flat', value: 'Flat', icon: '🏢' },
  { label: 'House', value: 'House', icon: '🏠' },
  { label: 'Office', value: 'Office Space', icon: '💼' },
  { label: 'Shop', value: 'Shop Space', icon: '🏬' },
  { label: 'Apartment', value: 'Apartment', icon: '🏙️' },
  { label: 'Land', value: 'Land', icon: '🌄' }
];

function CategoryFilter({ onCategorySelect }) {
  return (
    <section style={{padding: '32px 0 16px 0', textAlign: 'center', background:'#fff'}}>
      <h2 style={{marginBottom: 20, color:'var(--primary)'}}>Popular Categories</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 0}}>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategorySelect && onCategorySelect(cat.value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: '2px solid var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: 16,
              boxShadow: '0 2px 8px #1976d211',
              cursor: 'pointer',
              minWidth: 120,
              minHeight: 100,
              fontSize: 18,
              fontWeight: 500,
              padding: '18px 16px',
              margin: 4,
              transition: 'box-shadow 0.2s, border 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #1976d244'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #1976d211'}
          >
            <span style={{fontSize: 32, marginBottom: 8}}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryFilter;
