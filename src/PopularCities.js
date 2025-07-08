import React from 'react';

const cities = [
  { name: 'Kathmandu', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pokhara', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80' },
  { name: 'Lalitpur', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { name: 'Biratnagar', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chitwan', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3e92?auto=format&fit=crop&w=400&q=80' },
];

function PopularCities({ onCitySelect }) {
  return (
    <section>
      <h2 className="card-title" style={{ textAlign: 'center', marginBottom: 24 }}>Popular Cities</h2>
      <div style={{ display: 'flex', gap: 24, overflowX: 'auto', justifyContent: 'center', padding: '0 12px' }}>
        {cities.map(city => (
          <div
            key={city.name}
            onClick={() => onCitySelect && onCitySelect(city.name)}
            className="card"
            style={{
              minWidth: 180,
              cursor: 'pointer',
              borderRadius: 16,
              textAlign: 'center',
              padding: 12,
              transition: 'box-shadow 0.2s',
            }}
          >
            <img src={city.img} alt={city.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--primary)' }}>{city.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularCities;
