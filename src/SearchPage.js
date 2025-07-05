import React, { useState } from 'react';
import FiltersSidebar from './FiltersSidebar';
import SortBar from './SortBar';
import ListingsGrid from './ListingsGrid';
import MapView from './MapView';

function SearchPage() {
  const [filters, setFilters] = useState({
    rentMin: '',
    rentMax: '',
    location: '',
    roomType: '',
    gender: '',
  });
  const [sortBy, setSortBy] = useState('price');

  return (
    <div style={{display:'flex',gap:24,alignItems:'flex-start',padding:'32px 0',maxWidth:1400,margin:'0 auto'}}>
      <FiltersSidebar filters={filters} setFilters={setFilters} />
      <div style={{flex:1,minWidth:0}}>
        <SortBar sortBy={sortBy} setSortBy={setSortBy} />
        <ListingsGrid filters={filters} sortBy={sortBy} />
      </div>
      <div style={{width:420,minWidth:320}}>
        <MapView filters={filters} />
      </div>
    </div>
  );
}

export default SearchPage;
