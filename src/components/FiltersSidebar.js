import React from 'react';

const roomTypes = [
  { label: 'Private', value: 'Private' },
  { label: 'Shared', value: 'Shared' }
];
const genders = [
  { label: 'Any', value: 'Any' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' }
];
const amenities = [
  { label: 'WiFi', value: 'wifi', icon: '📶' },
  { label: 'Parking', value: 'parking', icon: '🚗' },
  { label: 'Furnished', value: 'furnished', icon: '🧺' },
  { label: 'Attached Bath', value: 'attachedBath', icon: '🚿' },
  { label: 'Pet Allowed', value: 'pet', icon: '🐾' }
];

function FiltersSidebar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
  };
  const handleAmenityToggle = (value) => {
    setFilters(f => ({ ...f, [value]: !f[value] }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      width: '100%',
      minWidth: 0,
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Room Type</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {roomTypes.map(rt => (
            <button
              key={rt.value}
              onClick={() => handleChange('roomType', rt.value)}
              style={{
                background: filters.roomType === rt.value ? 'var(--primary-gradient)' : 'var(--surface-hover)',
                color: filters.roomType === rt.value ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: filters.roomType === rt.value ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 20px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: filters.roomType === rt.value ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition)',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.border = '2px solid var(--primary)'}
              onBlur={e => e.currentTarget.style.border = filters.roomType === rt.value ? '2px solid var(--primary)' : '1px solid var(--gray-200)'}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Gender Preference</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {genders.map(g => (
            <button
              key={g.value}
              onClick={() => handleChange('gender', g.value)}
              style={{
                background: filters.gender === g.value ? 'var(--primary-gradient)' : 'var(--surface-hover)',
                color: filters.gender === g.value ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: filters.gender === g.value ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 20px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: filters.gender === g.value ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition)',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.border = '2px solid var(--primary)'}
              onBlur={e => e.currentTarget.style.border = filters.gender === g.value ? '2px solid var(--primary)' : '1px solid var(--gray-200)'}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Amenities & Preferences</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {amenities.map(a => (
            <button
              key={a.value}
              onClick={() => handleAmenityToggle(a.value)}
              style={{
                background: filters[a.value] ? 'var(--primary-gradient)' : 'var(--surface-hover)',
                color: filters[a.value] ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: filters[a.value] ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: filters[a.value] ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition)',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.border = '2px solid var(--primary)'}
              onBlur={e => e.currentTarget.style.border = filters[a.value] ? '2px solid var(--primary)' : '1px solid var(--gray-200)'}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FiltersSidebar;
