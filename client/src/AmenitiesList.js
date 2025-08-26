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

function AmenitiesList({ amenities = [] }) {
  return (
    <div className="flex gap-4 flex-wrap my-6">
      {amenities.map(a => (
        <span key={a} className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-lg px-4 py-2 text-base font-medium shadow">
          <span className="text-xl">{icons[a] || '✔️'}</span> {a}
        </span>
      ))}
    </div>
  );
}

export default AmenitiesList;
