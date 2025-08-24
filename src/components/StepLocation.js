import React, { useState } from 'react';

import { motion } from 'framer-motion';


const StepLocation = ({ data, updateData, next, back }) => {
  const [location, setLocation] = useState(data.location || {
    address: '',
    lat: '',
    lng: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!location.address.trim()) newErrors.address = 'Address is required.';
    if (!location.lat || isNaN(location.lat)) newErrors.lat = 'Valid latitude required.';
    if (!location.lng || isNaN(location.lng)) newErrors.lng = 'Valid longitude required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      updateData('location', location);
      next();
    }
  };

  return (
    <motion.div
      className="step-location"
      style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ marginBottom: 8 }}>Location</h2>
      <label>Address *</label>
      <input name="address" placeholder="e.g. 123 Main St, Kathmandu" value={location.address} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      {errors.address && <span style={{ color: 'red', fontSize: 13 }}>{errors.address}</span>}

      <label>Latitude *</label>
      <input name="lat" placeholder="e.g. 27.7172" value={location.lat} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      {errors.lat && <span style={{ color: 'red', fontSize: 13 }}>{errors.lat}</span>}

      <label>Longitude *</label>
      <input name="lng" placeholder="e.g. 85.3240" value={location.lng} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      {errors.lng && <span style={{ color: 'red', fontSize: 13 }}>{errors.lng}</span>}

      <div style={{ margin: '10px 0', padding: 12, border: '1px dashed #bbb', borderRadius: 8, background: '#fafbfc', color: '#777', fontSize: 14 }}>
        <b>Map Picker (Coming Soon):</b> You will be able to pin the exact location on a map here.
      </div>
    </motion.div>
  );
};

export default StepLocation;
