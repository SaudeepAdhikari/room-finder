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
    maxPrice: 50000,
    guests: {
      adults: 1
    },
    tags: [],
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

  const toggleTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
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
          {/* Price Range Slider */}
          <div className="modern-price-slider-group" style={{ flex: 1, padding: '0 20px' }}>
            <div className="slider-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
              <span>Max Monthly Budget</span>
              <span style={{ color: '#7c3aed' }}>Rs {filters.maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#7c3aed' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 15, padding: '0 20px' }}>
            {['Student Friendly', 'Pet Friendly', 'Attached Bath', 'Parking'].map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1.5px solid',
                  borderColor: filters.tags.includes(tag) ? '#7c3aed' : '#e2e8f0',
                  background: filters.tags.includes(tag) ? '#f5f3ff' : 'transparent',
                  color: filters.tags.includes(tag) ? '#7c3aed' : '#64748b',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {filters.tags.includes(tag) && <span>✓</span>} {tag}
              </button>
            ))}
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
