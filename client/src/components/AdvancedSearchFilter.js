import React, { useState, useRef, useEffect } from 'react';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUsers,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

import './AdvancedSearchFilter.css';
import './ExactSearchLayoutFix.css';
const AdvancedSearchFilter = ({
  onSearch,
  initialFilters = {},
  className = ''
}) => {
  // Main search state
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [50, 500],
    guests: {
      adults: 2
    },
    ...initialFilters
  });

  // UI state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [adultsDropdownOpen, setAdultsDropdownOpen] = useState(false);
  const [rentType, setRentType] = useState('monthly'); // 'monthly' or 'weekly'

  // Refs for click outside handling
  const locationFieldRef = useRef(null);
  const adultsDropdownRef = useRef(null);

  // Predefined city suggestions
  const citySuggestions = [
    { id: 1, name: 'Pokhara', country: 'Nepal' },
    { id: 2, name: 'Lalitpur', country: 'Nepal' },
    { id: 3, name: 'Bhaktapur', country: 'Nepal' },
    { id: 4, name: 'Kathmandu', country: 'Nepal' },
    { id: 5, name: 'Biratnagar', country: 'Nepal' },
    { id: 6, name: 'Birgunj', country: 'Nepal' },
    { id: 7, name: 'Dharan', country: 'Nepal' },
    { id: 8, name: 'Hetauda', country: 'Nepal' }
  ];

  // Filter city suggestions based on input
  const [locationSuggestions, setLocationSuggestions] = useState(citySuggestions);

  useEffect(() => {
    if (filters.location.trim() === '') {
      setLocationSuggestions(citySuggestions);
    } else {
      const filteredSuggestions = citySuggestions.filter(city => 
        city.name.toLowerCase().includes(filters.location.toLowerCase())
      );
      setLocationSuggestions(filteredSuggestions);
    }
  }, [filters.location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationFieldRef.current && !locationFieldRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (adultsDropdownRef.current && !adultsDropdownRef.current.contains(event.target)) {
        setAdultsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  // Adults dropdown options
  const adultsOptions = [1, 2, 3, 4, 5, 6];

  return (
    <div className="modern-room-search">
      <div className="modern-search-bar">
        {/* Location Field */}
        <div className="modern-location-field" ref={locationFieldRef}>
          <input
            type="text"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, location: e.target.value }));
              setShowLocationDropdown(true);
            }}
            onClick={() => setShowLocationDropdown(true)}
          />
          <div className="field-icon">
            <FaMapMarkerAlt />
          </div>
          
          {/* Location dropdown with suggestions */}
          {showLocationDropdown && (
            <div className="location-dropdown">
              {locationSuggestions.length > 0 ? (
                locationSuggestions.map(city => (
                  <div 
                    key={city.id}
                    className="location-item"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, location: city.name }));
                      setShowLocationDropdown(false);
                    }}
                  >
                    <div className="location-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="location-details">
                      <div className="location-name">{city.name}</div>
                      <div className="location-country">{city.country}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '10px 15px', color: '#aaa' }}>No cities found</div>
              )}
            </div>
          )}
        </div>

        {/* Toggle and Price Row */}
        <div className="toggle-price-row">
          {/* Rent Toggle */}
          <div className="modern-rent-toggle">
            <div className="modern-rent-toggle-buttons">
              <button 
                className={rentType === 'monthly' ? 'active' : ''}
                onClick={() => setRentType('monthly')}
              >
                Monthly
              </button>
              <button 
                className={rentType === 'weekly' ? 'active' : ''}
                onClick={() => setRentType('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="modern-price-range">
            <div className="price-label">Rs 50</div>
            <input
              type="number"
              className="price-input"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newRange = [...filters.priceRange];
                newRange[0] = Math.max(50, parseInt(e.target.value) || 50);
                setFilters(prev => ({ ...prev, priceRange: newRange }));
              }}
            />
            <div className="price-label">Rs 500</div>
            <input
              type="number"
              className="price-input"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newRange = [...filters.priceRange];
                newRange[1] = Math.min(10000, parseInt(e.target.value) || 500);
                setFilters(prev => ({ ...prev, priceRange: newRange }));
              }}
            />
          </div>
        </div>

        {/* Adults and Search Button Row */}
        <div className="adults-search-row">
          {/* Adults Dropdown */}
          <div className="modern-adults-dropdown" ref={adultsDropdownRef}>
            <div 
              className="modern-adults-selector"
              onClick={() => setAdultsDropdownOpen(!adultsDropdownOpen)}
            >
              <FaUsers className="adults-icon" />
              <span>{filters.guests.adults} adults</span>
              <FaChevronDown className={`chevron ${adultsDropdownOpen ? 'open' : ''}`} />
            </div>
            
            {adultsDropdownOpen && (
              <div className="adults-dropdown-menu">
                {adultsOptions.map(num => (
                  <div 
                    key={num}
                    className={`adults-dropdown-item ${filters.guests.adults === num ? 'selected' : ''}`}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        guests: { ...prev.guests, adults: num }
                      }));
                      setAdultsDropdownOpen(false);
                    }}
                  >
                    {num} adults
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button 
            className="search-button"
            onClick={handleSearch}
          >
            <FaSearch />
            <span>Find Rooms</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchFilter;
