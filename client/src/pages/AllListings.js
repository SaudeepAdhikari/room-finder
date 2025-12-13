import React, { useEffect, useState } from 'react';
import { fetchRooms, fetchNearbyRooms, fetchAdvancedSearchRooms } from '../api';
import { Link, useLocation } from 'react-router-dom';
import './AllListings.css';

import { useToast } from '../context/ToastContext';
import { FaLocationArrow, FaSpinner, FaSortAmountDown } from 'react-icons/fa';

// Haversine formula to calculate distance in km
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const toRad = (val) => val * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function AllListings() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [sortedByDistance, setSortedByDistance] = useState(false);

  const { showToast } = useToast();
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

    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const equipment = searchParams.get('equipment');
    const capacity = searchParams.get('capacity');

    let fetchPromise;

    if (lat && lon) {
      console.log(`AllListings: Searching nearby (${lat}, ${lon})`);
      fetchPromise = fetchNearbyRooms(lat, lon);
    } else if (equipment || capacity) {
      console.log('AllListings: Using Advanced Search (MCRSFA)');
      fetchPromise = fetchAdvancedSearchRooms({
        keyword: searchQuery,
        equipment,
        capacity,
        ...apiParams // pass other params if needed
      });
    } else {
      fetchPromise = fetchRooms(apiParams);
    }

    fetchPromise
      .then(data => { if (mounted) setRooms(data || []); })
      .catch(err => { if (mounted) setError(err.message || 'Failed to load listings'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [location.search]);

  // Handle "Show Rooms Near Me" click
  const handleSortNearMe = () => {
    if (sortedByDistance) {
      // Toggle off: Reset simple sort by reloading or just by re-sorting by default? 
      // Re-fetching is safer to restore original order, but let's just reverse the flag to reload or simple ID sort.
      // Easiest is to reload from API or cache original defaultOrder. 
      // For now, let's just reload via the existing effect by not doing anything locally, 
      // OR better: reload page effectively or just re-fetch.
      // Let's toggle variable and re-fetch to be clean.
      setSortedByDistance(false);
      window.location.reload(); // Simple reset
      return;
    }

    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLon } = position.coords;

        // Sort rooms: closest first, then those without location
        const sortedRooms = [...rooms].sort((a, b) => {
          const hasLocA = a.latitude && a.longitude;
          const hasLocB = b.latitude && b.longitude;

          if (hasLocA && hasLocB) {
            const distA = haversineDistance(userLat, userLon, a.latitude, a.longitude);
            const distB = haversineDistance(userLat, userLon, b.latitude, b.longitude);
            // Attach distance for display if we wanted
            a.distanceKm = distA;
            b.distanceKm = distB;
            return distA - distB; // Ascending distance
          }
          if (hasLocA && !hasLocB) return -1; // A comes first
          if (!hasLocA && hasLocB) return 1;  // B comes first
          return 0; // Both no location
        });

        setRooms(sortedRooms);
        setSortedByDistance(true);
        setIsLocating(false);
        showToast('Rooms sorted by distance to you!', 'success');
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsLocating(false);
        let msg = "Unable to retrieve your location.";
        if (error.code === 1) msg = "Location permission denied.";
        showToast(msg, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="alllistings-root">
      <div className="alllistings-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="alllistings-heading" style={{ margin: 0 }}>All Listed Rooms</h2>

        <button
          onClick={handleSortNearMe}
          className="btn-gradient"
          disabled={isLocating}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '30px', border: 'none',
            color: '#fff', fontWeight: 600, cursor: isLocating ? 'wait' : 'pointer',
            opacity: isLocating ? 0.8 : 1,
            fontSize: '0.95rem'
          }}
        >
          {isLocating ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaLocationArrow />}
          {isLocating ? 'Locating...' : (sortedByDistance ? 'Clear "Near Me"' : 'Show Rooms Near Me')}
        </button>
      </div>

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
              {room.distanceKm !== undefined && (
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(0,0,0,0.7)', color: '#fff',
                  padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600
                }}>
                  {room.distanceKm < 1 ? `${(room.distanceKm * 1000).toFixed(0)}m` : `${room.distanceKm.toFixed(1)} km`} away
                </div>
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
