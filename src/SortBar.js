import React from 'react';

function SortBar({ sortBy, setSortBy }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
      <span style={{fontWeight:600}}>Sort by:</span>
      <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:8,borderRadius:8}}>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="distance">Distance</option>
      </select>
    </div>
  );
}

export default SortBar;
