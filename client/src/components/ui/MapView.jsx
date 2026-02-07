import React, { useEffect, useRef } from 'react';

const MapView = ({ rooms, center = [27.7172, 85.324], zoom = 13 }) => {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        // Initialize map if not already done
        if (!leafletMap.current && window.L) {
            leafletMap.current = window.L.map(mapRef.current).setView(center, zoom);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMap.current);
        }

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!leafletMap.current || !window.L) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const validRooms = (rooms || []).filter(r => r.latitude && r.longitude);

        validRooms.forEach(room => {
            const marker = window.L.marker([room.latitude, room.longitude])
                .addTo(leafletMap.current)
                .bindPopup(`
          <div class="map-popup">
            <img src="${room.imageUrl || (room.images && room.images[0]) || ''}" style="width:100%; border-radius:8px; margin-bottom:8px;" />
            <h4 style="margin:0; font-size:14px;">${room.title}</h4>
            <p style="margin:4px 0; color:#7c3aed; font-weight:700;">NPR ${room.price.toLocaleString()}</p>
            <a href="/listings/${room._id}" style="color:#7c3aed; font-size:12px; font-weight:600;">View Details</a>
          </div>
        `);
            markersRef.current.push(marker);
        });

        if (validRooms.length > 0) {
            const group = new window.L.featureGroup(markersRef.current);
            leafletMap.current.fitBounds(group.getBounds().pad(0.1));
        }
    }, [rooms]);

    return (
        <div
            ref={mapRef}
            className="interactive-map-container"
            style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
    );
};

export default MapView;
