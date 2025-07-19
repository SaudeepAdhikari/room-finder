import React, { useState, useRef, useEffect } from 'react';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaBuilding,
  FaUmbrellaBeach
} from 'react-icons/fa';
import './AdvancedSearchFilter.css';

const AdvancedSearchFilter = ({
  onSearch,
  initialFilters = {},
  className = '',
  variant = 'horizontal' // horizontal, vertical, compact
}) => {
  // Main search state
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 2,
      children: 0,
      infants: 0
    },
    priceRange: [50, 500],
    propertyType: '',
    amenities: [],
    ...initialFilters
  });

  // UI state
  const [activeField, setActiveField] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  // Add rentType state for toggle
  const [rentType, setRentType] = useState('month'); // 'month' or 'week'
  // Add state for adults dropdown
  const [adultsDropdownOpen, setAdultsDropdownOpen] = useState(false);
  const adultsOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  // Refs
  const locationInputRef = useRef(null);
  const guestDropdownRef = useRef(null);

  // Sample location data (in real app, this would come from an API)
  const popularDestinations = [
    { id: 1, name: 'Kathmandu', country: 'Nepal', type: 'city' },
    { id: 2, name: 'Pokhara', country: 'Nepal', type: 'city' },
    { id: 3, name: 'Lalitpur', country: 'Nepal', type: 'city' },
    { id: 4, name: 'Bhaktapur', country: 'Nepal', type: 'city' },
    { id: 5, name: 'Chitwan', country: 'Nepal', type: 'city' },
    { id: 6, name: 'Dharan', country: 'Nepal', type: 'city' },
    { id: 7, name: 'Biratnagar', country: 'Nepal', type: 'city' },
    { id: 8, name: 'Butwal', country: 'Nepal', type: 'city' },
    { id: 9, name: 'Nepalgunj', country: 'Nepal', type: 'city' },
    { id: 10, name: 'Janakpur', country: 'Nepal', type: 'city' },
    { id: 11, name: 'Dhangadhi', country: 'Nepal', type: 'city' },
    { id: 12, name: 'Hetauda', country: 'Nepal', type: 'city' },
    { id: 13, name: 'Itahari', country: 'Nepal', type: 'city' },
    { id: 14, name: 'Bharatpur', country: 'Nepal', type: 'city' },
    { id: 15, name: 'Birgunj', country: 'Nepal', type: 'city' }
  ];

  const propertyTypes = [
    { id: 'house', label: 'House', icon: FaHome },
    { id: 'apartment', label: 'Apartment', icon: FaBuilding },
    { id: 'villa', label: 'Villa', icon: FaUmbrellaBeach }
  ];

  const amenityOptions = [
    'WiFi', 'Pool', 'Parking', 'Kitchen', 'Air Conditioning',
    'Gym', 'Pet Friendly', 'Balcony', 'Hot Tub', 'Fireplace'
  ];

  // Location autocomplete
  useEffect(() => {
    if (filters.location.length > 0) {
      const filtered = popularDestinations.filter(dest =>
        dest.name.toLowerCase().includes(filters.location.toLowerCase()) ||
        dest.country.toLowerCase().includes(filters.location.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationDropdown(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    }
  }, [filters.location]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get tomorrow's date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleLocationSelect = (destination) => {
    setFilters(prev => ({ ...prev, location: destination.name }));
    setShowLocationDropdown(false);
    setActiveField(null);
  };

  const handleGuestChange = (type, operation) => {
    setFilters(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: operation === 'increment'
          ? prev.guests[type] + 1
          : Math.max(0, prev.guests[type] - 1)
      }
    }));
  };

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(e.target.value);

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: { adults: 2, children: 0, infants: 0 },
      priceRange: [50, 500],
      propertyType: '',
      amenities: []
    });
  };

  const getTotalGuests = () => {
    return filters.guests.adults + filters.guests.children;
  };

  const formatGuestText = () => {
    const { adults, children, infants } = filters.guests;
    let text = `${adults} adult${adults !== 1 ? 's' : ''}`;
    if (children > 0) text += `, ${children} child${children !== 1 ? 'ren' : ''}`;
    if (infants > 0) text += `, ${infants} infant${infants !== 1 ? 's' : ''}`;
    return text;
  };

  return (
    <div className="modern-room-search" style={{
      background: 'linear-gradient(120deg, #18122B 60%, #23234d 100%)',
      borderRadius: 40,
      boxShadow: '0 8px 40px 0 #7c3aed55, 0 1.5px 0 #38bdf8',
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      maxWidth: 1100,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      border: '1.5px solid #7c3aed',
    }}>
      <div className="modern-search-bar" style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        boxShadow: '0 2px 24px #a78bfa33',
        borderRadius: 32,
        background: 'rgba(30, 30, 50, 0.95)',
        padding: '1.2rem 2rem',
        position: 'relative',
      }}>
        {/* Location Field */}
        <div className="modern-location-field" style={{ minWidth: 260, flex: 2, position: 'relative' }}>
          <label style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, letterSpacing: 1 }}>CITY/LOCATION</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#18122B', borderRadius: 16, boxShadow: '0 0 0 2px #7c3aed44', padding: '0.5rem 1.2rem', transition: 'box-shadow 0.18s', position: 'relative' }}>
            <FaMapMarkerAlt style={{ color: '#38bdf8', fontSize: 22, marginRight: 10 }} />
            <input
              type="text"
              placeholder="Search any city worldwide..."
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              onFocus={() => setActiveField('location')}
              className="modern-location-input"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: 18,
                width: '100%',
                fontWeight: 600,
                letterSpacing: 0.5,
                transition: 'box-shadow 0.18s',
              }}
            />
          </div>
          {/* Location dropdown placeholder for autocomplete */}
          {showLocationDropdown && (
            <div className="modern-location-dropdown" style={{
              position: 'absolute',
              top: 56,
              left: 0,
              width: '100%',
              background: '#23234d',
              borderRadius: 16,
              boxShadow: '0 4px 24px #7c3aed33',
              zIndex: 10,
              color: '#fff',
            }}>
              <div className="dropdown-header">
                <h4>Popular cities in Nepal</h4>
              </div>
              <div className="location-suggestions">
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map(destination => (
                    <button
                      key={destination.id}
                      className="location-suggestion"
                      onClick={() => handleLocationSelect(destination)}
                    >
                      <FaMapMarkerAlt className="suggestion-icon" />
                      <div className="suggestion-text">
                        <span className="destination-name">{destination.name}</span>
                        <span className="destination-country">{destination.country}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="no-suggestions">No cities found</div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Rent Type Toggle */}
        <div className="modern-rent-toggle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
          <label style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, letterSpacing: 1 }}>RENT</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#23234d', borderRadius: 16, boxShadow: '0 0 0 2px #a78bfa55', padding: '4px 10px', gap: 6 }}>
            <button
              onClick={() => setRentType('month')}
              style={{
                background: rentType === 'month' ? 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)' : 'transparent',
                color: rentType === 'month' ? '#fff' : '#aaa',
                border: 'none',
                borderRadius: 10,
                padding: '4px 14px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: rentType === 'month' ? '0 0 8px #7c3aed88' : 'none',
                transition: 'all 0.18s',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setRentType('week')}
              style={{
                background: rentType === 'week' ? 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)' : 'transparent',
                color: rentType === 'week' ? '#fff' : '#aaa',
                border: 'none',
                borderRadius: 10,
                padding: '4px 14px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: rentType === 'week' ? '0 0 8px #38bdf888' : 'none',
                transition: 'all 0.18s',
              }}
            >
              Weekly
            </button>
          </div>
        </div>
        {/* Price Range Dual Slider */}
        <div className="modern-price-range" style={{ minWidth: 340, flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <label style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, letterSpacing: 1 }}>PRICE RANGE (Rs)</label>
          <div className="modern-price-slider" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div className="modern-price-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: 22, textShadow: '0 0 8px #38bdf8aa' }}>Rs {filters.priceRange[0]}</span>
              <input
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={e => handlePriceRangeChange(e, 0)}
                className="modern-slider"
                style={{ width: 120, accentColor: '#38bdf8', boxShadow: '0 0 8px #38bdf8aa', cursor: 'pointer', background: '#23234d', color: '#fff', border: '1.5px solid #7c3aed', borderRadius: 10, fontWeight: 700, fontSize: 18, padding: '0.4rem 0.7rem', textAlign: 'center' }}
              />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 28, textShadow: '0 0 8px #a78bfa88' }}>–</span>
            <div className="modern-price-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: 22, textShadow: '0 0 8px #a78bfa88' }}>Rs {filters.priceRange[1]}</span>
              <input
                type="number"
                min="0"
                value={filters.priceRange[1]}
                onChange={e => handlePriceRangeChange(e, 1)}
                className="modern-slider"
                style={{ width: 120, accentColor: '#a78bfa', boxShadow: '0 0 8px #a78bfa88', cursor: 'pointer', background: '#23234d', color: '#fff', border: '1.5px solid #a78bfa', borderRadius: 10, fontWeight: 700, fontSize: 18, padding: '0.4rem 0.7rem', textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
        {/* Adults Dropdown */}
        <div className="modern-adults-dropdown" style={{ minWidth: 120, position: 'relative', flex: 1 }}>
          <label style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6, letterSpacing: 1 }}>ADULTS</label>
          <div
            style={{
              background: '#18122B',
              borderRadius: 16,
              boxShadow: '0 0 0 2px #7c3aed44',
              padding: '0.5rem 1.2rem',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.18s',
            }}
            onClick={() => setAdultsDropdownOpen((o) => !o)}
            onBlur={() => setAdultsDropdownOpen(false)}
            tabIndex={0}
          >
            <FaUsers style={{ color: '#a78bfa', fontSize: 22, marginRight: 10 }} />
            {filters.guests.adults} adult{filters.guests.adults > 1 ? 's' : ''}
            <FaChevronDown style={{ marginLeft: 10, color: '#38bdf8', fontSize: 18, transition: 'transform 0.18s', transform: adultsDropdownOpen ? 'rotate(180deg)' : 'none' }} />
          </div>
          {adultsDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 56,
              left: 0,
              width: '100%',
              background: '#23234d',
              borderRadius: 16,
              boxShadow: '0 4px 24px #7c3aed33',
              zIndex: 10,
              color: '#fff',
              padding: '0.5rem 0',
            }}>
              {adultsOptions.map(opt => (
                <div
                  key={opt}
                  style={{
                    padding: '0.5rem 1.2rem',
                    cursor: 'pointer',
                    background: filters.guests.adults === opt ? 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)' : 'transparent',
                    color: filters.guests.adults === opt ? '#fff' : '#a78bfa',
                    fontWeight: 700,
                    borderRadius: 10,
                    margin: '2px 0',
                    transition: 'background 0.18s',
                  }}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, guests: { ...prev.guests, adults: opt } }));
                    setAdultsDropdownOpen(false);
                  }}
                >
                  {opt} adult{opt > 1 ? 's' : ''}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Search Button and Filters inside main bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 18 }}>
          <button className="modern-search-btn" onClick={handleSearch} style={{
            background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 20,
            border: 'none',
            borderRadius: 24,
            padding: '1.1rem 2.6rem',
            boxShadow: '0 0 16px #a78bfa88, 0 4px 16px #7c3aed22',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            transition: 'box-shadow 0.18s, transform 0.18s',
            textShadow: '0 0 8px #fff8',
          }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 32px #a78bfa, 0 8px 32px #7c3aed44'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 0 16px #a78bfa88, 0 4px 16px #7c3aed22'; e.currentTarget.style.transform = 'none'; }}
          >
            <FaSearch style={{ fontSize: 26, filter: 'drop-shadow(0 0 8px #fff8)' }} />
            <span>Search</span>
          </button>
          <button className="modern-filters-btn" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} style={{
            background: 'linear-gradient(90deg, #23234d 0%, #7c3aed 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            borderRadius: 18,
            padding: '1rem 1.7rem',
            boxShadow: '0 0 12px #7c3aed88',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            transition: 'box-shadow 0.18s, transform 0.18s',
          }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 24px #7c3aed, 0 8px 32px #a78bfa44'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 0 12px #7c3aed88'; e.currentTarget.style.transform = 'none'; }}
          >
            <FaFilter style={{ fontSize: 24, color: '#a78bfa', filter: 'drop-shadow(0 0 8px #a78bfa)' }} />
            <span>Filters</span>
            {(filters.amenities.length > 0 || filters.propertyType) && (
              <div className="filter-count" style={{ background: '#7c3aed', color: '#fff', borderRadius: 8, padding: '2px 8px', marginLeft: 6, fontSize: 15, fontWeight: 800 }}>{filters.amenities.length + (filters.propertyType ? 1 : 0)}</div>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="advanced-filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>

          <div className="filters-content">
            {/* Property Type */}
            <div className="filter-section">
              <h4 className="filter-title">Property type</h4>
              <div className="property-types">
                {propertyTypes.map(type => (
                  <button
                    key={type.id}
                    className={`property-type-btn ${filters.propertyType === type.id ? 'active' : ''}`}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      propertyType: prev.propertyType === type.id ? '' : type.id
                    }))}
                  >
                    <type.icon className="property-icon" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="filter-section">
              <h4 className="filter-title">Amenities</h4>
              <div className="amenities-grid">
                {amenityOptions.map(amenity => (
                  <button
                    key={amenity}
                    className={`amenity-btn ${filters.amenities.includes(amenity) ? 'active' : ''}`}
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    {amenity}
                    {filters.amenities.includes(amenity) && (
                      <FaTimes className="remove-amenity" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filters-footer">
            <button className="apply-filters-btn" onClick={() => setShowAdvancedFilters(false)}>
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilter;
