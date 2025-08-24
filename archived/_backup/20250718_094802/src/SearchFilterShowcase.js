import React, { useState } from 'react';
import AdvancedSearchFilter from './components/AdvancedSearchFilter';
import './SearchFilterShowcase.css';

const SearchFilterShowcase = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [lastSearch, setLastSearch] = useState(null);

  const handleSearch = (filters) => {
    setLastSearch(filters);
    
    // Simulate search results
    const mockResults = {
      resultsCount: Math.floor(Math.random() * 500) + 50,
      searchTime: (Math.random() * 2 + 0.5).toFixed(2),
      filters: filters
    };
    
    setSearchResults(mockResults);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="search-filter-showcase">
      {/* Hero Section */}
      <div className="showcase-hero">
        <div className="hero-content">
          <h1 className="hero-title">Advanced Search & Filter</h1>
          <p className="hero-description">
            Modern, Airbnb-style search interface with glassmorphism effects, 
            location autocomplete, and comprehensive filtering options
          </p>
        </div>
        
        {/* Search Filter Component */}
        <div className="search-demo-container">
          <AdvancedSearchFilter
            onSearch={handleSearch}
            variant="horizontal"
          />
        </div>
      </div>

      {/* Search Results Display */}
      {searchResults && (
        <div className="search-results-section">
          <div className="container">
            <div className="results-header">
              <h2>Search Results</h2>
              <p>
                Found <strong>{searchResults.resultsCount}</strong> properties 
                in <strong>{searchResults.searchTime}s</strong>
              </p>
            </div>

            <div className="search-summary">
              <div className="summary-card">
                <h3>Search Parameters</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Location:</span>
                    <span className="summary-value">
                      {lastSearch?.location || 'Any location'}
                    </span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Check-in:</span>
                    <span className="summary-value">
                      {formatDate(lastSearch?.checkIn)}
                    </span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Check-out:</span>
                    <span className="summary-value">
                      {formatDate(lastSearch?.checkOut)}
                    </span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Guests:</span>
                    <span className="summary-value">
                      {lastSearch?.guests ? 
                        `${lastSearch.guests.adults + lastSearch.guests.children} guests` :
                        'Not specified'
                      }
                    </span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Price Range:</span>
                    <span className="summary-value">
                      {lastSearch?.priceRange ? 
                        `${formatPrice(lastSearch.priceRange[0])} - ${formatPrice(lastSearch.priceRange[1])}` :
                        'Any price'
                      }
                    </span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Property Type:</span>
                    <span className="summary-value">
                      {lastSearch?.propertyType || 'Any type'}
                    </span>
                  </div>
                  
                  {lastSearch?.amenities && lastSearch.amenities.length > 0 && (
                    <div className="summary-item">
                      <span className="summary-label">Amenities:</span>
                      <span className="summary-value">
                        {lastSearch.amenities.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Location Search</h3>
              <p>Autocomplete functionality with popular destinations and real-time suggestions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Date Selection</h3>
              <p>Intuitive date pickers with validation to ensure check-out is after check-in</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Guest Management</h3>
              <p>Detailed guest selection with adults, children, and infants categorization</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Price Range Slider</h3>
              <p>Dual-handle range slider for precise price filtering with visual feedback</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Property Types</h3>
              <p>Visual property type selection with icons for houses, apartments, and villas</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Amenities Filter</h3>
              <p>Multi-select amenities with visual indicators and easy toggle functionality</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Glassmorphism Design</h3>
              <p>Modern glass-like effects with backdrop blur for a premium visual experience</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Layout</h3>
              <p>Mobile-first design that adapts beautifully to all screen sizes and devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="technical-section">
        <div className="container">
          <h2 className="section-title">Technical Implementation</h2>
          
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Modern CSS Features</h3>
              <ul>
                <li>CSS Grid & Flexbox layouts</li>
                <li>Backdrop-filter for glassmorphism</li>
                <li>CSS custom properties</li>
                <li>Advanced animations & transitions</li>
                <li>Responsive breakpoints</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>React Functionality</h3>
              <ul>
                <li>useState for state management</li>
                <li>useEffect for side effects</li>
                <li>useRef for DOM manipulation</li>
                <li>Event handling & validation</li>
                <li>Component composition</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>Accessibility Features</h3>
              <ul>
                <li>ARIA labels and roles</li>
                <li>Keyboard navigation</li>
                <li>Screen reader support</li>
                <li>High contrast mode</li>
                <li>Reduced motion support</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>User Experience</h3>
              <ul>
                <li>Click outside to close dropdowns</li>
                <li>Loading states & animations</li>
                <li>Form validation</li>
                <li>Touch-optimized controls</li>
                <li>Visual feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="usage-section">
        <div className="container">
          <h2 className="section-title">Usage Examples</h2>
          
          <div className="code-examples">
            <div className="code-card">
              <h3>Basic Implementation</h3>
              <pre className="code-block">
{`<AdvancedSearchFilter
  onSearch={(filters) => {
  }}
  variant="horizontal"
/>`}
              </pre>
            </div>
            
            <div className="code-card">
              <h3>With Initial Filters</h3>
              <pre className="code-block">
{`<AdvancedSearchFilter
  onSearch={handleSearch}
  initialFilters={{
    location: 'New York',
    guests: { adults: 2, children: 1 },
    priceRange: [100, 300]
  }}
  variant="horizontal"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterShowcase;
