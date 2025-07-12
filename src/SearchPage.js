import React, { useState } from 'react';
import FiltersSidebar from './FiltersSidebar';
import SortBar from './SortBar';
import ListingsGrid from './ListingsGrid';
import MapView from './MapView';
import Container from './components/Container';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    rentMin: '',
    rentMax: '',
    location: '',
    roomType: '',
    gender: '',
  });
  const [sortBy, setSortBy] = useState('price');
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => setShowResults(true);

  return (
    <Container>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ minWidth: 260 }}>
          <button
            style={{
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
              marginBottom: 18,
            }}
            onClick={() => setShowFilters(f => !f)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {showFilters && (
            <div style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)', padding: '32px 18px', minWidth: 260 }}>
              <FiltersSidebar filters={filters} setFilters={setFilters} onSearch={handleSearch} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SortBar sortBy={sortBy} setSortBy={setSortBy} />
          <div style={{ marginTop: 24 }}>
            {showResults && <ListingsGrid filters={filters} sortBy={sortBy} />}
          </div>
        </div>
        <div style={{ width: 420, minWidth: 320 }}>
          <div style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)', padding: 18 }}>
            <MapView filters={filters} />
          </div>
        </div>
      </div>
    </Container>
  );
}
