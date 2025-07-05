import React, { useEffect, useState } from 'react';
import { fetchRooms } from './api';

function RoomList({ search = '', category = '' }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.location = search;
    if (category) params.category = category;
    fetchRooms(params)
      .then(setRooms)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {rooms.map(room => (
          <div key={room._id} style={{ border: '1px solid #ccc', margin: 8, padding: 24, borderRadius: 12, background: '#fff', width: 340, boxShadow: '0 2px 8px #0001' }}>
            <h3 style={{margin:'0 0 8px 0'}}>{room.title}</h3>
            <p style={{margin:'8px 0'}}>{room.description}</p>
            <p><b>Category:</b> {room.category || 'N/A'}</p>
            <p><b>Location:</b> {room.location}</p>
            <p><b>Price:</b> ${room.price}</p>
            {room.amenities && room.amenities.length > 0 && (
              <p><b>Amenities:</b> {room.amenities.join(', ')}</p>
            )}
            {room.imageUrl && <img src={room.imageUrl} alt={room.title} style={{ maxWidth: '100%', borderRadius: 4, marginTop: 8 }} />}
          </div>
        ))}
      </div>
      {!loading && rooms.length === 0 && (
        <p style={{textAlign:'center', marginTop:32, color:'#999'}}>No rooms found. Try adjusting your filters.</p>
      )}
    </div>
  );
}

export default RoomList;
