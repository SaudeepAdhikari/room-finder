"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _fa = require("react-icons/fa");
var _api = require("../api");
require("./AdminSearchBar.css");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AdminSearchBar = () => {
  const [query, setQuery] = (0, _react.useState)('');
  const [results, setResults] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [selectedIndex, setSelectedIndex] = (0, _react.useState)(-1);
  const [showResults, setShowResults] = (0, _react.useState)(false);
  const searchRef = (0, _react.useRef)(null);
  const inputRef = (0, _react.useRef)(null);
  const resultsRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    const handleClickOutside = event => {
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
  (0, _react.useEffect)(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);
  const performSearch = async searchQuery => {
    if (!searchQuery || searchQuery.length < 2) return;
    setLoading(true);
    try {
      const data = await (0, _api.searchAdminAutocomplete)(searchQuery);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = e => {
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
        setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1);
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
  (0, _react.useEffect)(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`.admin-search-result-item[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);
  const getSelectedItem = () => {
    if (!results || selectedIndex < 0) return null;
    const roomCount = results.rooms?.length || 0;
    const userCount = results.users?.length || 0;
    if (selectedIndex < roomCount) {
      return {
        type: 'room',
        item: results.rooms[selectedIndex]
      };
    } else if (selectedIndex < roomCount + userCount) {
      return {
        type: 'user',
        item: results.users[selectedIndex - roomCount]
      };
    } else {
      return {
        type: 'booking',
        item: results.bookings[selectedIndex - roomCount - userCount]
      };
    }
  };
  const handleResultClick = result => {
    if (!result) return;

    // Navigate to the appropriate page based on the result type
    switch (result.type) {
      case 'room':
        // Set the active tab to rooms and maybe filter for this specific room
        window.dispatchEvent(new CustomEvent('adminNavigate', {
          detail: {
            tab: 'rooms',
            filter: result.item._id
          }
        }));
        break;
      case 'user':
        // Set the active tab to users and maybe filter for this specific user
        window.dispatchEvent(new CustomEvent('adminNavigate', {
          detail: {
            tab: 'users',
            filter: result.item._id
          }
        }));
        break;
      case 'booking':
        // Set the active tab to bookings and maybe filter for this specific booking
        window.dispatchEvent(new CustomEvent('adminNavigate', {
          detail: {
            tab: 'bookings',
            filter: result.item._id
          }
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
        icon = /*#__PURE__*/_react.default.createElement(_fa.FaHome, null);
        primary = item.title;
        secondary = item.location;
        status = item.status;
        break;
      case 'user':
        icon = /*#__PURE__*/_react.default.createElement(_fa.FaUser, null);
        primary = item.email;
        secondary = [item.firstName, item.lastName].filter(Boolean).join(' ');
        break;
      case 'booking':
        icon = /*#__PURE__*/_react.default.createElement(_fa.FaCalendarAlt, null);
        primary = `Booking #${item.bookingId}`;
        secondary = `${item.userId?.email || 'Unknown user'} • $${item.totalAmount}`;
        status = item.status;
        break;
      default:
        return null;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      key: `${type}-${item._id}`,
      className: `admin-search-result-item ${selectedIndex === index ? 'selected' : ''}`,
      onClick: () => handleResultClick({
        type,
        item
      }),
      "data-index": index
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-result-icon"
    }, icon), /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-result-content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-result-primary"
    }, primary), /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-result-secondary"
    }, secondary)), status && /*#__PURE__*/_react.default.createElement("div", {
      className: `admin-search-result-status admin-search-status-${status.toLowerCase()}`
    }, status));
  };
  const renderResults = () => {
    if (!results) return null;
    const {
      rooms = [],
      users = [],
      bookings = []
    } = results;
    let currentIndex = 0;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-results",
      ref: resultsRef
    }, rooms.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category-title"
    }, "Rooms"), rooms.map(room => {
      const index = currentIndex++;
      return renderResultItem(room, 'room', index);
    })), users.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category-title"
    }, "Users"), users.map(user => {
      const index = currentIndex++;
      return renderResultItem(user, 'user', index);
    })), bookings.length > 0 && /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-category-title"
    }, "Bookings"), bookings.map(booking => {
      const index = currentIndex++;
      return renderResultItem(booking, 'booking', index);
    })), rooms.length === 0 && users.length === 0 && bookings.length === 0 && !loading && /*#__PURE__*/_react.default.createElement("div", {
      className: "admin-search-no-results"
    }, "No results found for \"", query, "\""));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-container",
    ref: searchRef
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-input-container"
  }, /*#__PURE__*/_react.default.createElement(_fa.FaSearch, {
    className: "admin-search-icon"
  }), /*#__PURE__*/_react.default.createElement("input", {
    ref: inputRef,
    type: "text",
    className: "admin-search-input",
    placeholder: "Search users, rooms, bookings...",
    value: query,
    onChange: e => setQuery(e.target.value),
    onFocus: () => query.length >= 2 && setShowResults(true),
    onKeyDown: handleKeyDown
  }), query && /*#__PURE__*/_react.default.createElement("button", {
    className: "admin-search-clear",
    onClick: () => {
      setQuery('');
      setResults(null);
      inputRef.current.focus();
    }
  }, /*#__PURE__*/_react.default.createElement(_fa.FaTimes, null)), loading && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-loading"
  })), showResults && /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-dropdown"
  }, loading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-loading-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-search-loading-spinner"
  }), /*#__PURE__*/_react.default.createElement("div", null, "Searching...")) : renderResults()));
};
var _default = exports.default = AdminSearchBar;