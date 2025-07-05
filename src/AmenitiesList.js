import React from 'react';

const icons = {
  Wifi: '📶',
  Laundry: '🧺',
  Furnished: '🛋️',
  Parking: '🚗',
  AC: '❄️',
  Heater: '🔥',
  TV: '📺',
  Kitchen: '🍳',
};

function AmenitiesList({ amenities }) {
  return (
    <div style={{margin:'24px 0',display:'flex',gap:18,flexWrap:'wrap'}}>
      {amenities.map(a => (
        <span key={a} style={{display:'flex',alignItems:'center',gap:6,background:'#f6f8fa',borderRadius:8,padding:'8px 14px',fontSize:16,fontWeight:500}}>
          <span style={{fontSize:20}}>{icons[a] || '✔️'}</span> {a}
        </span>
      ))}
    </div>
  );
}

export default AmenitiesList;
