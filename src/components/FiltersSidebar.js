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
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 18, color: 'var(--primary)' }}>Filters</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Rent Range</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => handleChange('minPrice', e.target.value)}
            style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: 20, width: 80 }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => handleChange('maxPrice', e.target.value)}
            style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: 20, width: 80 }}
          />
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Location</div>
        <input
          type="text"
          placeholder="City or Area"
          value={filters.location || ''}
          onChange={e => handleChange('location', e.target.value)}
          style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: 20, marginBottom: 12 }}
        />
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Room Type</div>
        <select
          value={filters.roomType || 'Any'}
          onChange={e => handleChange('roomType', e.target.value)}
          style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: 20, marginBottom: 12 }}
        >
          <option value="Any">Any</option>
          {roomTypes.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
        </select>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Gender Preference</div>
        <select
          value={filters.gender || 'Any'}
          onChange={e => handleChange('gender', e.target.value)}
          style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: 20, marginBottom: 12 }}
        >
          <option value="Any">Any</option>
          {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
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
