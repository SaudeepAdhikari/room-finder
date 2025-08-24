import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaFilter } from 'react-icons/fa';

import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: ''
  });

  const [particles, setParticles] = useState([]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const particleArray = [];
      for (let i = 0; i < 50; i++) {
        particleArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 20
        });
      }
      setParticles(particleArray);
    };

    generateParticles();
  }, []);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Navigate to search results with search data
    const searchParams = new URLSearchParams(searchData);
    navigate(`/search?${searchParams.toString()}`);
  };

  const roomTypes = [
    'Any Type',
    'Single Room',
    'Double Room',
    'Shared Room',
    'Studio',
    'Apartment',
    'House'
  ];

  return (
    <section className="hero-section">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="gradient-overlay"></div>
        
        {/* Floating Particles */}
        <div className="particles-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>

        {/* 3D House Illustration Container */}
        <div className="house-illustration">
          <div className="house-3d">
            <div className="house-base"></div>
            <div className="house-roof"></div>
            <div className="house-door"></div>
            <div className="house-window house-window-1"></div>
            <div className="house-window house-window-2"></div>
            <div className="house-chimney"></div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Discover Your Perfect
            <span className="gradient-text"> SajiloStay</span>
          </h1>
          <p className="hero-subtitle">
            🏠 Find amazing rooms, apartments, and homes across Nepal
            <br />
            ✨ Your dream accommodation awaits - book with confidence
            <br />
            🌟 Join thousands of happy travelers who found their perfect stay
          </p>
          
          {/* Quick stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
          </div>
        </div>

        {/* Glassmorphism Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            {/* Location Field */}
            <div className="search-field">
              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="field-content">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Check-in Field */}
            <div className="search-field">
              <div className="field-icon">
                <FaCalendarAlt />
              </div>
              <div className="field-content">
                <label>Check-in</label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                />
              </div>
            </div>

            {/* Check-out Field */}
            <div className="search-field">
              <div className="field-icon">
                <FaCalendarAlt />
              </div>
              <div className="field-content">
                <label>Check-out</label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                />
              </div>
            </div>

            {/* Guests Field */}
            <div className="search-field">
              <div className="field-icon">
                <FaUsers />
              </div>
              <div className="field-content">
                <label>Guests</label>
                <select
                  value={searchData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Type Field */}
            <div className="search-field">
              <div className="field-icon">
                <FaFilter />
              </div>
              <div className="field-content">
                <label>Room Type</label>
                <select
                  value={searchData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button className="search-button" onClick={handleSearch}>
              <FaSearch />
              <span>Search</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            <span className="filter-label">Popular:</span>
            <button className="filter-chip" onClick={() => handleInputChange('location', 'Kathmandu')}>
              Kathmandu
            </button>
            <button className="filter-chip" onClick={() => handleInputChange('location', 'Pokhara')}>
              Pokhara
            </button>
            <button className="filter-chip" onClick={() => handleInputChange('location', 'Chitwan')}>
              Chitwan
            </button>
            <button className="filter-chip" onClick={() => handleInputChange('roomType', 'Studio')}>
              Studio
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-stats">
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Guests</div>
            </div>
            <div className="stat">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Verified Properties</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities</div>
            </div>
          </div>
          
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => navigate('/rooms')}>
              Explore Rooms
            </button>
            <button className="cta-secondary" onClick={() => navigate('/post-room')}>
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="trust-section">
        <div className="trust-badges">
          <div className="trust-badge">
            <div className="trust-icon">🛡️</div>
            <span>Verified Properties</span>
          </div>
          <div className="trust-badge">
            <div className="trust-icon">⭐</div>
            <span>5-Star Reviews</span>
          </div>
          <div className="trust-badge">
            <div className="trust-icon">🔒</div>
            <span>Secure Booking</span>
          </div>
          <div className="trust-badge">
            <div className="trust-icon">📞</div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 