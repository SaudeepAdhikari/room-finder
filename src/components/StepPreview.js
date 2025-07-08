import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { addRoom } from '../api';

const StepPreview = ({ data, back, isLast, onNavigate }) => {
  const { details, images, location, amenities, roommatePreference, availabilityCalendar, rentDocuments } = data;
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const { showToast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Compose room data for backend
      const room = {
        title: details.title,
        description: details.description,
        price: details.price,
        location: location?.address || '',
        amenities,
        imageUrl: images && images.length > 0 ? images[0] : '', // cover image
        images, // all image URLs (optional, for future multi-image support)
        roommatePreference,
        availabilityCalendar,
        rentDocuments,
      };
      await addRoom(room);
      setLoading(false);
      setSuccess(true);
      showToast('Room posted successfully!', 'success');
      if (onNavigate) onNavigate('home');
    } catch (e) {
      setLoading(false);
      setError('Failed to post room. Please try again.');
      showToast('Failed to post room', 'error');
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 32, background: '#f6fff6', borderRadius: 16, boxShadow: '0 2px 24px #1976d214', textAlign: 'center' }}>
        <h2 style={{ color: '#1976d2' }}>Room Posted Successfully!</h2>
        <div style={{ fontSize: 18, margin: '24px 0' }}>Your listing is now live.</div>
        <button onClick={back} style={{ padding: '12px 32px', background: 'var(--primary-gradient)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer' }}>Post Another</button>
      </div>
    );
  }

  return (
    <motion.div
      className="step-preview"
      style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 24px #1976d210', padding: 32 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ marginBottom: 18 }}>Preview Your Listing</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 2, minWidth: 220 }}>
          <div style={{ fontSize: 23, fontWeight: 700, marginBottom: 8 }}>{details.title}</div>
          <div style={{ color: '#555', marginBottom: 16, whiteSpace: 'pre-wrap' }}>{details.description}</div>
          <table style={{ width: '100%', fontSize: 16, marginBottom: 18 }}>
            <tbody>
              <tr><td style={{ fontWeight: 600 }}>Price:</td><td style={{ color: '#1976d2' }}>NPR {details.price}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Available:</td><td>{details.availableFrom} to {details.availableTo || 'Flexible'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Location:</td><td>{location.address} <span style={{ fontSize: 13, color: '#888' }}>({location.lat}, {location.lng})</span></td></tr>
              <tr><td style={{ fontWeight: 600 }}>Amenities:</td><td>{amenities.join(', ')}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Roommate Preference:</td><td>{roommatePreference}</td></tr>
              <tr><td style={{ fontWeight: 600, verticalAlign: 'top' }}>Availability Calendar:</td><td>{(availabilityCalendar && availabilityCalendar.length > 0) ? <ul style={{ margin: 0, paddingLeft: 18 }}>{availabilityCalendar.map((rng, i) => (<li key={i}>{rng.start} to {rng.end}</li>))}</ul> : 'Not specified'}</td></tr>
              <tr><td style={{ fontWeight: 600, verticalAlign: 'top' }}>Rent Documents:</td><td>{(rentDocuments && rentDocuments.length > 0) ? <ul style={{ margin: 0, paddingLeft: 18 }}>{rentDocuments.map((doc, i) => (<li key={i}>{doc.name || (doc.path && doc.path.split('\\').pop())}</li>))}</ul> : 'None uploaded'}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {images && images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
        <button onClick={back} style={{ padding: '12px 0', background: '#eee', color: '#444', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', flex: 1 }}>Back</button>
        <button onClick={handleSubmit} disabled={loading || !isLast} style={{ padding: '12px 0', background: 'var(--primary-gradient)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', flex: 2, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 12, fontSize: 15 }}>{error}</div>}
    </motion.div>
  );
};

export default StepPreview;
