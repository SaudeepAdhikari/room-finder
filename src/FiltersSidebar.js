import React, { useState } from 'react';

function FiltersSidebar({ filters, setFilters, onSearch }) {
  const [showTextBox, setShowTextBox] = useState(false);
  const [textValue, setTextValue] = useState('');

  const handleSearchClick = () => {
    setShowTextBox(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, location: textValue }));
    setShowTextBox(false);
    if (onSearch) onSearch();
  };

  return (
    <aside className="filters-sidebar" style={{ borderRadius: 16, boxShadow: '0 2px 8px #1976d211', padding: 24, minWidth: 220, maxWidth: 260 }}>
      <h3 style={{ color: 'var(--primary)', marginBottom: 16 }}>Filters</h3>
      <div style={{ marginBottom: 16 }}>
        <label>Rent Range</label><br />
        <input type="number" placeholder="Min" value={filters.rentMin} onChange={e => setFilters(f => ({ ...f, rentMin: e.target.value }))} style={{ width: 90, marginRight: 8 }} />
        <input type="number" placeholder="Max" value={filters.rentMax} onChange={e => setFilters(f => ({ ...f, rentMax: e.target.value }))} style={{ width: 90 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Location</label><br />
        <input type="text" placeholder="City or Area" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Room Type</label><br />
        <select value={filters.roomType} onChange={e => setFilters(f => ({ ...f, roomType: e.target.value }))} style={{ width: '100%' }}>
          <option value="">Any</option>
          <option value="Private">Private</option>
          <option value="Shared">Shared</option>
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Gender Preference</label><br />
        <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} style={{ width: '100%' }}>
          <option value="">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button
        style={{
          marginTop: 18,
          width: '100%',
          padding: '12px 0',
          background: 'var(--primary-gradient)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 17,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #7c3aed22',
          transition: 'background 0.18s',
        }}
        onClick={handleSearchClick}
      >
        Search
      </button>
      {showTextBox && (
        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <input
            type="text"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            placeholder="Type your search..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 10,
              border: '1.5px solid var(--primary-light)',
              marginBottom: 10,
              fontSize: 16,
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'var(--primary-gradient)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #7c3aed22',
              transition: 'background 0.18s',
            }}
          >
            Search
          </button>
        </form>
      )}
    </aside>
  );
}

export default FiltersSidebar;
