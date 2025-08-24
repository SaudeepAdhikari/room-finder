import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaUser, FaHome, FaCalendarAlt } from 'react-icons/fa';

import { searchAdminAutocomplete } from '../api';
import './AdminSearchBar.css';

const AdminSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) return;
    
    setLoading(true);
    try {
      const data = await searchAdminAutocomplete(searchQuery);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Don't handle navigation keys if no results
    if (!results) return;
    
    const roomCount = results?.rooms?.length || 0;
    const userCount = results?.users?.length || 0;
    const bookingCount = results?.bookings?.length || 0;
    const totalItems = roomCount + userCount + bookingCount;
    
    if (totalItems === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1) ? prev + 1 : 0);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0) ? prev - 1 : totalItems - 1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(getSelectedItem());
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        break;
        
      default:
        break;
    }
  };
  
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`.admin-search-result-item[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const getSelectedItem = () => {
    if (!results || selectedIndex < 0) return null;
    
    const roomCount = results.rooms?.length || 0;
    const userCount = results.users?.length || 0;
    
    if (selectedIndex < roomCount) {
      return { type: 'room', item: results.rooms[selectedIndex] };
    } else if (selectedIndex < roomCount + userCount) {
      return { type: 'user', item: results.users[selectedIndex - roomCount] };
    } else {
      return { type: 'booking', item: results.bookings[selectedIndex - roomCount - userCount] };
    }
  };

  const handleResultClick = (result) => {
    if (!result) return;
    
    // Navigate to the appropriate page based on the result type
    switch (result.type) {
      case 'room':
        // Set the active tab to rooms and maybe filter for this specific room
        window.dispatchEvent(new CustomEvent('adminNavigate', { 
          detail: { tab: 'rooms', filter: result.item._id }
        }));
        break;
        
      case 'user':
        // Set the active tab to users and maybe filter for this specific user
        window.dispatchEvent(new CustomEvent('adminNavigate', { 
          detail: { tab: 'users', filter: result.item._id }
        }));
        break;
        
      case 'booking':
        // Set the active tab to bookings and maybe filter for this specific booking
        window.dispatchEvent(new CustomEvent('adminNavigate', { 
          detail: { tab: 'bookings', filter: result.item._id }
        }));
        break;
        
      default:
        break;
    }
    
    setShowResults(false);
    setQuery('');
  };

  const renderResultItem = (item, type, index) => {
    let icon, primary, secondary, status;
    
    switch (type) {
      case 'room':
        icon = <FaHome />;
        primary = item.title;
        secondary = item.location;
        status = item.status;
        break;
        
      case 'user':
        icon = <FaUser />;
        primary = item.email;
        secondary = [item.firstName, item.lastName].filter(Boolean).join(' ');
        break;
        
      case 'booking':
        icon = <FaCalendarAlt />;
        primary = `Booking #${item.bookingId}`;
        secondary = `${item.userId?.email || 'Unknown user'} • $${item.totalAmount}`;
        status = item.status;
        break;
        
      default:
        return null;
    }
    
    return (
      <div 
        key={`${type}-${item._id}`}
        className={`admin-search-result-item ${selectedIndex === index ? 'selected' : ''}`}
        onClick={() => handleResultClick({ type, item })}
        data-index={index}
      >
        <div className="admin-search-result-icon">
          {icon}
        </div>
        <div className="admin-search-result-content">
          <div className="admin-search-result-primary">{primary}</div>
          <div className="admin-search-result-secondary">{secondary}</div>
        </div>
        {status && (
          <div className={`admin-search-result-status admin-search-status-${status.toLowerCase()}`}>
            {status}
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;
    
    const { rooms = [], users = [], bookings = [] } = results;
    let currentIndex = 0;
    
    return (
      <div className="admin-search-results" ref={resultsRef}>
        {rooms.length > 0 && (
          <div className="admin-search-category">
            <div className="admin-search-category-title">Rooms</div>
            {rooms.map((room) => {
              const index = currentIndex++;
              return renderResultItem(room, 'room', index);
            })}
          </div>
        )}
        
        {users.length > 0 && (
          <div className="admin-search-category">
            <div className="admin-search-category-title">Users</div>
            {users.map((user) => {
              const index = currentIndex++;
              return renderResultItem(user, 'user', index);
            })}
          </div>
        )}
        
        {bookings.length > 0 && (
          <div className="admin-search-category">
            <div className="admin-search-category-title">Bookings</div>
            {bookings.map((booking) => {
              const index = currentIndex++;
              return renderResultItem(booking, 'booking', index);
            })}
          </div>
        )}
        
        {rooms.length === 0 && users.length === 0 && bookings.length === 0 && !loading && (
          <div className="admin-search-no-results">
            No results found for "{query}"
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-search-container" ref={searchRef}>
      <div className="admin-search-input-container">
        <FaSearch className="admin-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="admin-search-input"
          placeholder="Search users, rooms, bookings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button 
            className="admin-search-clear" 
            onClick={() => {
              setQuery('');
              setResults(null);
              inputRef.current.focus();
            }}
          >
            <FaTimes />
          </button>
        )}
        {loading && <div className="admin-search-loading"></div>}
      </div>
      
      {showResults && (
        <div className="admin-search-dropdown">
          {loading ? (
            <div className="admin-search-loading-container">
              <div className="admin-search-loading-spinner"></div>
              <div>Searching...</div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSearchBar;
