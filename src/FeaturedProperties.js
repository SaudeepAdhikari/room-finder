import React, { useEffect, useState } from 'react';
import { fetchRooms } from './api';

function FeaturedProperties() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchRooms({ featured: true })
      .then(setFeatured)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2 className="card-title" style={{ textAlign: 'center' }}>Featured Properties</h2>
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {error && <p className="card-error" style={{ textAlign: 'center' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
        {featured.map(room => (
          <div key={room._id} className="card" style={{ borderRadius: 8, padding: 20, width: 320 }}>
            <h3 style={{ color: 'var(--text-primary)' }}>{room.title}</h3>
            <p style={{ margin: '8px 0' }}>{room.description}</p>
            <p><b>Category:</b> {room.category || 'N/A'}</p>
            <p><b>Location:</b> {room.location}</p>
            <p><b>Price:</b> NPR {room.price}</p>
            {room.imageUrl && <img src={room.imageUrl} alt={room.title} style={{ maxWidth: '100%', borderRadius: 4, marginTop: 8 }} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProperties;
