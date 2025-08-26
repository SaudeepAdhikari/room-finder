import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import RoomInfo from '../RoomInfo';
import AmenitiesList from '../AmenitiesList';
import ReviewsSection from '../ReviewsSection';
import ContactHostButton from '../ContactHostButton';
import { fetchRoomById } from '../api';

function PanoramaViewer({ imageUrl, open, onClose }) {
  const viewerRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    let viewer;
    if (open && imageUrl && containerRef.current) {
      // Simple 360° viewer fallback
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.cursor = 'grab';

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(img);

      // Add basic pan functionality
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let translateX = 0;
      let translateY = 0;

      const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        img.style.cursor = 'grabbing';
      };

      const handleMouseMove = (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
      };

      const handleMouseUp = () => {
        isDragging = false;
        img.style.cursor = 'grab';
      };

      img.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      viewerRef.current = {
        destroy: () => {
          img.removeEventListener('mousedown', handleMouseDown);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
      };
    }
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [open, imageUrl]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, maxWidth: 700, width: '90vw', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 18 }}>✕</button>
        <div ref={containerRef} style={{ width: '100%', height: 400, borderRadius: 8, overflow: 'hidden' }} />
      </div>
    </div>
  );
}

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panoOpen, setPanoOpen] = useState(false);
  const [panoUrl, setPanoUrl] = useState('');

  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchRoomById(id);
        setRoom(data);
      } catch (err) {
        console.error('RoomDetailPage fetch error:', err);
        setError('Failed to load room.');
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (error || !room) return <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>{error || 'Room not found.'}</div>;

  return (
    <main className="container room-detail-layout" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      {room.images && room.images.length > 0 ? (
        <img src={room.images[0]} alt="Room" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #1976d211', marginBottom: 24 }} />
      ) : (
        <img src={room.imageUrl} alt="Room" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #1976d211', marginBottom: 24 }} />
      )}
      <RoomInfo title={room.title} price={room.price} available={true} roommatePref={room.roommatePreference} />
      {/* Uploader / contact summary */}
      <section style={{ marginTop: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={room.user?.avatar || '/logo192.png'} alt={room.user?.firstName || 'Host'} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{room.user ? `${room.user.firstName || ''} ${room.user.lastName || ''}`.trim() : (room.contactInfo && room.contactInfo.name) || 'Host'}</div>
            <div style={{ color: '#111' }}>{room.user?.email || (room.contactInfo && room.contactInfo.email) || ''}</div>
            <div style={{ color: '#111' }}>{room.user?.phone || (room.contactInfo && room.contactInfo.phone) || ''}</div>
          </div>
        </div>
      </section>
      {/* Address and posted details */}
      <section style={{ marginTop: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Property Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px', width: 180 }}>Address</td><td style={{ padding: '6px 8px' }}>{room.location || [room.address, room.city, room.state].filter(Boolean).join(', ')}</td></tr>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px' }}>Security Deposit</td><td style={{ padding: '6px 8px' }}>{room.securityDeposit || (room.pricingDeposit && room.pricingDeposit.deposit) || 'N/A'}</td></tr>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px' }}>Available From</td><td style={{ padding: '6px 8px' }}>{room.availableFrom || '-'}</td></tr>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px' }}>Max Occupants</td><td style={{ padding: '6px 8px' }}>{room.maxOccupants || '-'}</td></tr>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px' }}>Room Type / Size</td><td style={{ padding: '6px 8px' }}>{[room.roomType, room.roomSize].filter(Boolean).join(' / ') || '-'}</td></tr>
            <tr><td style={{ fontWeight: 600, padding: '6px 8px' }}>Amenities</td><td style={{ padding: '6px 8px' }}>{(room.amenities && room.amenities.join(', ')) || '-'}</td></tr>
            {/* Rent Documents removed per UX request */}
          </tbody>
        </table>
      </section>
      {/* 360° Media Section */}
      {room.room360s && room.room360s.length > 0 && (
        <section style={{ margin: '2.5rem 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>360° Room Media</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {room.room360s.map((media, idx) => (
              <div key={idx} style={{ maxWidth: 320, textAlign: 'center', background: '#f8fafc', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #7c3aed11' }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>{media.title}</div>
                {media.imageUrl && media.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={media.imageUrl} controls style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                ) : (
                  <>
                    <img src={media.imageUrl} alt={media.title} style={{ width: '100%', borderRadius: 8, cursor: 'zoom-in' }} onClick={() => { setPanoUrl(media.imageUrl); setPanoOpen(true); }} />
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => { setPanoUrl(media.imageUrl); setPanoOpen(true); }} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 14, marginRight: 8 }}>View 360°</button>
                      <a href={media.imageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline', fontSize: 14 }}>Fullscreen</a>
                    </div>
                  </>
                )}
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{media.uploadedAt ? new Date(media.uploadedAt).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <PanoramaViewer imageUrl={panoUrl} open={panoOpen} onClose={() => setPanoOpen(false)} />
  <AmenitiesList amenities={room.amenities || []} />
  <ReviewsSection reviews={room.reviews || []} />
      <ContactHostButton />
    </main>
  );
};

export default RoomDetailPage;
