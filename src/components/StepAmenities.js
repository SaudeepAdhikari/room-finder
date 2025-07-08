import React, { useState } from 'react';
import { motion } from 'framer-motion';

const allAmenities = [
  'WiFi', 'Parking', 'Laundry', 'Kitchen', 'Air Conditioning', 'Heating', 'Furnished', 'Pet Friendly'
];

const StepAmenities = ({ data, updateData, next, back }) => {
  const [amenities, setAmenities] = useState(data.amenities || []);
  const [error, setError] = useState('');

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleNext = () => {
    if (amenities.length === 0) {
      setError('Please select at least one amenity.');
      return;
    }
    setError('');
    updateData('amenities', amenities);
    next();
  };

  return (
    <motion.div
      className="step-amenities"
      style={{maxWidth:500,margin:'0 auto',display:'flex',flexDirection:'column',gap:16}}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{marginBottom:8}}>Amenities</h2>
      <div style={{display:'flex',flexWrap:'wrap',gap:16,marginBottom:8}}>
        {allAmenities.map((amenity) => (
          <label key={amenity} style={{display:'flex',alignItems:'center',background:amenities.includes(amenity)?'#e3f0fd':'#fafbfc',border:'1px solid #ddd',borderRadius:20,padding:'6px 14px',fontWeight:500,cursor:'pointer',boxShadow:amenities.includes(amenity)?'0 2px 8px #1976d220':'none'}}>
            <input
              type="checkbox"
              checked={amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
              style={{marginRight:8}}
            />
            {amenity}
          </label>
        ))}
      </div>
      {error && <span style={{color:'red',fontSize:13}}>{error}</span>}
      <div style={{display:'flex',gap:10,marginTop:20}}>
        <button onClick={back} style={{padding:'10px 0',background:'#eee',color:'#444',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:1}}>Back</button>
        <button onClick={handleNext} style={{padding:'10px 0',background:'var(--primary-gradient)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,fontSize:16,cursor:'pointer',flex:2}}>
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepAmenities;
