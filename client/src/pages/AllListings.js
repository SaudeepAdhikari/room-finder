import React, { useEffect, useState } from 'react';
import { fetchRooms } from '../api';
import { Link, useLocation } from 'react-router-dom';
import './AllListings.css';

export default function AllListings() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    // Parse search params
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    // Prepare API params
    const apiParams = {};
    if (searchQuery) {
      console.log('AllListings: Searching for:', searchQuery);
      apiParams.search = searchQuery;
    } else {
      console.log('AllListings: No search query found');
    }

    fetchRooms(apiParams)
      .then(data => { if (mounted) setRooms(data || []); })
      .catch(err => { if (mounted) setError(err.message || 'Failed to load listings'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [location.search]);

  return (
    <div className="alllistings-root">
      <h2 className="alllistings-heading">All Listed Rooms</h2>
      {loading && <div className="alllistings-empty">Loading listings...</div>}
      {error && <div className="alllistings-error">{error}</div>}
      {!loading && !error && rooms.length === 0 && (
        <div className="alllistings-empty">No listings found.</div>
      )}
      <div className="alllistings-grid">
        {rooms.map(room => (
          <Link key={room._id} to={`/listings/${room._id}`} className="alllistings-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="alllistings-thumb">
              {room.imageUrl || (room.images && room.images[0]) ? (
                <img src={room.imageUrl || room.images[0]} alt={room.title} />
              ) : (
                <div className="alllistings-noimage">No image</div>
              )}
            </div>
            <div className="alllistings-body">
              <h3 className="alllistings-title">{room.title}</h3>
              <div className="alllistings-meta">{room.location} • <span className="alllistings-price">NPR {room.price?.toLocaleString()}</span></div>
              <p className="alllistings-desc">{room.description?.slice(0, 140)}{room.description?.length > 140 ? '…' : ''}</p>
              <div className="alllistings-footer">
                <span className={`status-badge status-${room.status || 'unknown'}`}>{room.status || 'unknown'}</span>
                <span className="alllistings-date">{new Date(room.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
